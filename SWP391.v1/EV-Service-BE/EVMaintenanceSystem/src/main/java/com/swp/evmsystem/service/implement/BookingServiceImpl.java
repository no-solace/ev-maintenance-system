package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.constants.BookingConstants;
import com.swp.evmsystem.dto.request.BookingRequest;
import com.swp.evmsystem.dto.response.*;
import com.swp.evmsystem.entity.BookingEntity;
import com.swp.evmsystem.entity.ElectricVehicleEntity;
import com.swp.evmsystem.entity.ServiceCenterEntity;
import com.swp.evmsystem.enums.*;
import com.swp.evmsystem.exception.BusinessException;
import com.swp.evmsystem.exception.ResourceNotFoundException;
import com.swp.evmsystem.mapper.ServiceCenterMapper;
import com.swp.evmsystem.repository.BookingRepository;
import com.swp.evmsystem.repository.CenterRepository;
import com.swp.evmsystem.repository.ElectricVehicleRepository;
import com.swp.evmsystem.repository.EmployeeRepository;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    final private BookingRepository bookingRepository;
    final private ElectricVehicleRepository vehicleRepository;
    final private CenterRepository centerRepository;
    final private ServiceCenterMapper serviceCenterMapper;
    final private com.swp.evmsystem.service.EmailService emailService;
    private final EmployeeRepository employeeRepository;

    /**
     * Create new booking for customer
     */
    @Override
    public synchronized BookingEntity createBookingEntity(BookingRequest request, UserEntityDetails user) {
        ElectricVehicleEntity vehicle = getVehicleById(request.getEVId());
        ServiceCenterEntity center = getCenterById(request.getCenterId());
        LocalDate date = request.getBookingDate();
        LocalTime time = request.getBookingTime();
        String notes = request.getNotes();
        String customerName = request.getCustomerName();
        String customerPhone = request.getCustomerPhone();
        String customerEmail = request.getCustomerEmail();
        String customerAddress = request.getCustomerAddress();

        validateOwnershipOfVehicle(vehicle, user);
        validateSlotAvailability(request);
        validateVehicleAvailability(vehicle);
        vehicle.setMaintenanceStatus(EvMaintenanceStatus.BOOKED);
        vehicleRepository.save(vehicle);

        BookingEntity booking = BookingEntity.builder()
                .vehicle(vehicle)
                .center(center)
                .bookingDate(date)
                .bookingTime(time)
                .status(BookingStatus.PENDING_PAYMENT)
                .notes(notes)
                .customerName(customerName)
                .customerPhone(customerPhone)
                .customerEmail(customerEmail)
                .customerAddress(customerAddress)
                .build();

        return saveBookingEntity(booking);
    }

    @Override
    public synchronized BookingResponseDTO createBooking(BookingRequest request, UserEntityDetails user) {
        return convertToDTO(createBookingEntity(request, user));
    }

    /**
     * Get booking entities
     */
    @Override
    public List<BookingEntity> getAllBookingEntities(Integer centerId) {
        if (centerId == null) {
            bookingRepository.findAll();
        }

        return bookingRepository.findByCenter_Id(centerId);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings(Integer centerId) {
        return getAllBookingEntities(centerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get booking entity by ID
     */
    @Override
    public BookingEntity getBookingEntityById(Integer bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    @Override
    public BookingResponseDTO getBookingById(Integer bookingId) {
        return convertToDTO(getBookingEntityById(bookingId));
    }

    /**
     * Get bookings by status
     */
    @Override
    public List<BookingEntity> getBookingEntitiesByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByStatus(BookingStatus status) {
        return getBookingEntitiesByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all bookings for a vehicle
     */
    @Override
    public List<BookingEntity> getBookingEntitiesByVehicleId(Integer vehicleId) {
        return bookingRepository.findByVehicle_Id(vehicleId);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByVehicleId(Integer vehicleId) {
        return getBookingEntitiesByVehicleId(vehicleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all bookings for a customer
     */
    @Override
    public List<BookingEntity> getBookingEntitiesByCustomerId(Integer customerId) {
        return bookingRepository.findByVehicle_OwnerId(customerId);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByCustomerId(Integer customerId) {
        return getBookingEntitiesByCustomerId(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Customer requests booking cancellation
     */
    @Override
    public void requestCancellation(Integer bookingId, String reason) {
        BookingEntity booking = getBookingEntityById(bookingId);

        validateCancellationRequest(booking);
        booking.setStatus(BookingStatus.CANCELLATION_REQUESTED);
        appendNote(booking, "Cancel reason: " + reason);
        saveBookingEntity(booking);
    }

    /**
     * Staff approves cancellation request
     */
    @Override
    public void approveCancellation(Integer bookingId) {
        BookingEntity booking = getBookingEntityById(bookingId);

        validatePendingCancellation(booking);
        booking.setStatus(BookingStatus.CANCELLED);
        freeUpVehicle(booking.getVehicle());
        saveBookingEntity(booking);

        // TODO: Process refund here if payment was made
    }

    /**
     * Staff rejects cancellation request
     */
    @Override
    public void rejectCancellation(Integer bookingId, String reason) {
        BookingEntity booking = getBookingEntityById(bookingId);

        validatePendingCancellation(booking);
        booking.setStatus(BookingStatus.UPCOMING);
        appendNote(booking, "Cancellation rejected reason: " + reason);
        saveBookingEntity(booking);
    }

    /**
     * Direct booking cancellation
     */
    @Override
    public void cancelBooking(Integer bookingId, String reason) {
        BookingEntity booking = getBookingEntityById(bookingId);

        validateDirectCancellation(booking);
        booking.setStatus(BookingStatus.CANCELLED);
        appendNote(booking, "Cancellation reason: " + reason);
        freeUpVehicle(booking.getVehicle());
        saveBookingEntity(booking);
    }

    /**
     * Confirm booking deposit payment
     */
    @Override
    public void confirmBookingDeposit(Integer bookingId) {
        BookingEntity booking = getBookingEntityById(bookingId);

        validatePendingPayment(booking);
        booking.setStatus(BookingStatus.UPCOMING);
        saveBookingEntity(booking);

        // Send booking receipt email automatically after payment success
        try {
            emailService.sendBookingReceiptEmail(booking);
            log.info("✅ Booking receipt email sent successfully for booking ID: {}", bookingId);
        } catch (Exception e) {
            // Log error but don't fail the payment confirmation
            log.error("❌ Failed to send booking receipt email for booking ID: {}. Error: {}",
                    bookingId, e.getMessage(), e);
        }
    }

    /**
     * Get booking statistics
     */
    @Override
    public BookingStatsDTO getBookingStatistics() {
        long total = bookingRepository.count();
        long pendingPayment = bookingRepository.countByStatus(BookingStatus.PENDING_PAYMENT);
        long upcoming = bookingRepository.countByStatus(BookingStatus.UPCOMING);
        long cancellationRequested = bookingRepository.countByStatus(BookingStatus.CANCELLATION_REQUESTED);
        long received = bookingRepository.countByStatus(BookingStatus.RECEIVED);
        long completed = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long cancelled = bookingRepository.countByStatus(BookingStatus.CANCELLED);

        return BookingStatsDTO.builder()
                .totalBookings(total)
                .pendingPaymentCount(pendingPayment)
                .upcomingCount(upcoming)
                .cancellationRequestedCount(cancellationRequested)
                .receivedCount(received)
                .completedCount(completed)
                .cancelledCount(cancelled)
                .build();
    }

    /**
     * Get available time slots for a service center on a specific date
     */
    @Override
    public TimeSlotResponseDTO getTimeSlotsByCenterIdAndDate(int centerId, LocalDate date) {
        ServiceCenterEntity center = getCenterById(centerId);
        Map<LocalTime, Integer> bookingsPerTimeSlot = getBookingsPerTimeSlot(center, date);
        List<TimeSlotDTO> slots = generateTimeSlots(center, date, bookingsPerTimeSlot);

        return TimeSlotResponseDTO.builder()
                .date(date)
                .center(serviceCenterMapper.toDTO(center))
                .slots(slots)
                .build();
    }

    /**
     * Get booking count map for each time slot
     */
    private Map<LocalTime, Integer> getBookingsPerTimeSlot(ServiceCenterEntity center, LocalDate date) {
        List<BookingRepository.BookingCountProjection> bookingCounts =
                bookingRepository.findByCenterAndBookingDate(center, date);

        return bookingCounts.stream()
                .collect(Collectors.toMap(
                        BookingRepository.BookingCountProjection::getTime,
                        BookingRepository.BookingCountProjection::getCount
                ));
    }

    /**
     * Generate time slots for a service center
     */
    private List<TimeSlotDTO> generateTimeSlots(ServiceCenterEntity center, LocalDate date,
                                                Map<LocalTime, Integer> bookingsPerTimeSlot) {
        LocalTime startTime = center.getStartTime();
        LocalTime endTime = center.getEndTime();
        int maxCapacity = employeeRepository.findTechniciansByCenterId(center.getId()).size();
        center.setMaxCapacity(maxCapacity);
        centerRepository.save(center);

        return Stream.iterate(startTime,
                        time -> time.isBefore(endTime),
                        time -> time.plusMinutes(BookingConstants.SLOT_DURATION))
                .map(time -> createTimeSlot(center.getId(), date, time, bookingsPerTimeSlot, maxCapacity))
                .collect(Collectors.toList());
    }

    /**
     * Create a single time slot DTO
     */
    private TimeSlotDTO createTimeSlot(int centerId, LocalDate date, LocalTime time,
                                       Map<LocalTime, Integer> bookingsPerTimeSlot, int maxCapacity) {
        int numOfBookings = bookingsPerTimeSlot.getOrDefault(time, 0);
        boolean isAvailable = isSlotAvailable(date, time, numOfBookings, maxCapacity);

        return TimeSlotDTO.builder()
                .date(date)
                .time(time)
                .centerId(centerId)
                .numOfBookings(numOfBookings)
                .maxCapacity(maxCapacity)
                .available(isAvailable)
                .build();
    }

    /**
     * Check if a time slot is available for booking
     */
    private boolean isSlotAvailable(LocalDate date, LocalTime time, int numOfBookings, int maxCapacity) {
        // Check capacity
        if (numOfBookings >= maxCapacity) {
            return false;
        }

        // Không cho phép đặt ngày trong quá khứ
        if (date.isBefore(LocalDate.now())) {
            return false;
        }
        // For today, check if slot is in the past or too soon
        if (date.equals(LocalDate.now())) {
            LocalTime minimumBookingTime = LocalTime.now().plusMinutes(BookingConstants.MINIMUM_ADVANCE_TIME);
            return time.isAfter(minimumBookingTime);
        }

        return true;
    }

    /**
     * Reschedule existing booking to new date/time
     */
    @Override
    public BookingEntity rescheduleBookingEntity(Integer bookingId, BookingRequest request) {
        BookingEntity booking = getBookingEntityById(bookingId);
        LocalDate newDate = request.getBookingDate();
        LocalTime newTime = request.getBookingTime();

        validateReschedule(booking);
        validateRescheduleSlot(booking.getCenter(), newDate, newTime);
        booking.setBookingDate(newDate);
        booking.setBookingTime(newTime);

        return saveBookingEntity(booking);
    }

    @Override
    public BookingResponseDTO rescheduleBooking(Integer bookingId, BookingRequest request) {
        return convertToDTO(rescheduleBookingEntity(bookingId, request));
    }

    /**
     * Scheduled task to automatically cancel bookings that haven't been paid within 15 minutes
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000)
    @Transactional
    @Override
    public void cancelExpiredUnpaidBookings() {
        String autoCancelNote = "Auto-cancelled: Payment not received within " + BookingConstants.PAYMENT_TIMEOUT_MINUTES + " minutes";

        try {
            List<BookingEntity> pendingPaymentBookings = getBookingEntitiesByStatus(BookingStatus.PENDING_PAYMENT);
            LocalDateTime now = LocalDateTime.now();
            int cancelledCount = 0;

            for (BookingEntity booking : pendingPaymentBookings) {

                if (booking.getCreatedAt() != null) {
                    long minutesElapsed = Duration.between(booking.getCreatedAt(), now).toMinutes();

                    if (minutesElapsed >= BookingConstants.PAYMENT_TIMEOUT_MINUTES) {
                        booking.setStatus(BookingStatus.CANCELLED);
                        appendNote(booking, autoCancelNote);
                        freeUpVehicle(booking.getVehicle());
                        saveBookingEntity(booking);

                        cancelledCount++;
                    }
                }
            }

            if (cancelledCount > 0) {
                log.info("Auto-cancelled {} expired unpaid bookings", cancelledCount);
            } else {
                log.debug("No expired unpaid bookings found");
            }

        } catch (Exception e) {
            log.error("Error during booking cleanup task", e);
        }
    }

    private ElectricVehicleEntity getVehicleById(Integer vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));
    }

    private ServiceCenterEntity getCenterById(Integer centerId) {
        return centerRepository.findById(centerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service center not found with ID: " + centerId));
    }

    private void validatePendingPayment(BookingEntity booking) {
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new BusinessException("Booking is not in PENDING_PAYMENT status");
        }
    }

    private void freeUpVehicle(ElectricVehicleEntity vehicle) {
        vehicle.setMaintenanceStatus(EvMaintenanceStatus.AVAILABLE);
        saveVehicleEntity(vehicle);
    }

    private void validateReschedule(BookingEntity booking) {

        if (booking.getStatus() != BookingStatus.UPCOMING) {
            throw new BusinessException("Cannot reschedule a " + booking.getStatus() + " booking");
        }

        // Check if booking is within minimum reschedule time window
        LocalDateTime bookingDateTime = LocalDateTime.of(booking.getBookingDate(), booking.getBookingTime());
        LocalDateTime minimumRescheduleTime = LocalDateTime.now().plusHours(BookingConstants.MINIMUM_RESCHEDULE_HOURS);

        if (bookingDateTime.isBefore(minimumRescheduleTime)) {
            throw new BusinessException(
                    "Cannot reschedule booking less than " + BookingConstants.MINIMUM_RESCHEDULE_HOURS +
                            " hours before appointment time"
            );
        }
    }

    private void validateRescheduleSlot(ServiceCenterEntity center, LocalDate newDate, LocalTime newTime) {
        long currentBookingCount = bookingRepository.countBookingsAtTime(center.getId(), newDate, newTime);
        if (currentBookingCount >= center.getMaxCapacity()) {
            throw new BusinessException("The selected time slot is full. Please choose another time.");
        }
    }

    private void appendNote(BookingEntity booking, String note) {
        if (note != null && !note.isEmpty()) {
            String existingNotes = booking.getNotes();
            booking.setNotes(existingNotes != null ? existingNotes + "\n" + note : note);
        }
    }

    private void validateVehicleAvailability(ElectricVehicleEntity electricVehicle) {
        if (electricVehicle.getMaintenanceStatus() != EvMaintenanceStatus.AVAILABLE) {
            throw new BusinessException("This vehicle cannot be booked because its maintenance status is " + electricVehicle.getMaintenanceStatus());
        }
    }

    private void validateSlotAvailability(BookingRequest request) {
        ServiceCenterEntity center = getCenterById(request.getCenterId());
        LocalDate bookingDate = request.getBookingDate();
        LocalTime bookingTime = request.getBookingTime();

        long currentBookingCount = bookingRepository.countBookingsAtTime(
                center.getId(),
                bookingDate,
                bookingTime
        );

        if (currentBookingCount >= center.getMaxCapacity()) {
            throw new BusinessException("This time slot is full. Please select another time.");
        }
    }

    private void validateOwnershipOfVehicle(ElectricVehicleEntity vehicle, UserEntityDetails user) {
        Integer ownerId = user.getId();
        if (!vehicleRepository.existsByIdAndOwnerId(vehicle.getId(), ownerId)) {
            throw new BusinessException("This vehicle does not belong to the current customer");
        }
    }

    private void validateCancellationRequest(BookingEntity booking) {
        if (booking.getStatus() != BookingStatus.UPCOMING) {
            throw new BusinessException("Can only request cancellation for confirmed bookings");
        }
    }

    private BookingEntity saveBookingEntity(BookingEntity booking) {
        return bookingRepository.save(booking);
    }

    private void validatePendingCancellation(BookingEntity booking) {
        if (booking.getStatus() != BookingStatus.CANCELLATION_REQUESTED) {
            throw new BusinessException("No pending cancellation request for this booking");
        }
    }

    private BookingResponseDTO convertToDTO(BookingEntity booking) {
        ElectricVehicleEntity vehicle = booking.getVehicle();
        VehicleModel model = vehicle.getModel();

        return BookingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                .center(booking.getCenter().getCenterName())
                .address(booking.getCenter().getCenterAddress().toString())
                .date(booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                .time(booking.getBookingTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .bookingDate(booking.getBookingDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .bookingTime(booking.getBookingTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .eVModel(model.getName())
                .vehicleModel(model.getName())
                .licensePlate(vehicle.getLicensePlate())
                .vin(vehicle.getVin())
                .hasWarranty(vehicle.getHasWarranty())
                .warrantyEndDate(vehicle.getWarrantyEndDate() != null
                        ? vehicle.getWarrantyEndDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                        : null)
                .customerName(booking.getCustomerName())
                .customerEmail(booking.getCustomerEmail())
                .customerPhone(booking.getCustomerPhone())
                .customerAddress(booking.getCustomerAddress())
                .notes(booking.getNotes())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private void saveVehicleEntity(ElectricVehicleEntity vehicle) {
        vehicleRepository.save(vehicle);
    }

    private void validateDirectCancellation(BookingEntity booking) {
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BusinessException("Cannot cancel a " + booking.getStatus() + " booking");
        }
    }

    /**
     * Get bookings grouped by time slots for a specific center on a specific date
     * Returns current slot + next 2 slots with full booking details
     */
    @Override
    public CenterBookingSlotsDTO getBookingSlotsByCenter(Integer centerId, LocalDate date) {
        ServiceCenterEntity center = getCenterById(centerId);
        LocalTime currentTime = LocalTime.now();

        // Calculate current slot (round down to the hour)
        LocalTime currentSlot = LocalTime.of(currentTime.getHour(), 0);
        LocalTime nextSlot1 = currentSlot.plusHours(1);
        LocalTime nextSlot2 = currentSlot.plusHours(2);

        // Get all bookings for this date at this center (optimized query)
        List<BookingEntity> allTodayBookings = bookingRepository.findByCenterIdAndBookingDate(centerId, date);

        // Group bookings by time slot
        List<BookingEntity> currentSlotBookings = allTodayBookings.stream()
                .filter(b -> b.getBookingTime().equals(currentSlot))
                .collect(Collectors.toList());

        List<BookingEntity> nextSlot1Bookings = allTodayBookings.stream()
                .filter(b -> b.getBookingTime().equals(nextSlot1))
                .collect(Collectors.toList());

        List<BookingEntity> nextSlot2Bookings = allTodayBookings.stream()
                .filter(b -> b.getBookingTime().equals(nextSlot2))
                .collect(Collectors.toList());

        // Build TimeSlotWithBookingsDTO for each slot
        TimeSlotWithBookingsDTO currentSlotDTO = TimeSlotWithBookingsDTO.builder()
                .slotTime(currentSlot)
                .isCurrentSlot(true)
                .bookingCount(currentSlotBookings.size())
                .bookings(currentSlotBookings.stream().map(this::convertToDTO).collect(Collectors.toList()))
                .build();

        TimeSlotWithBookingsDTO nextSlot1DTO = TimeSlotWithBookingsDTO.builder()
                .slotTime(nextSlot1)
                .isCurrentSlot(false)
                .bookingCount(nextSlot1Bookings.size())
                .bookings(nextSlot1Bookings.stream().map(this::convertToDTO).collect(Collectors.toList()))
                .build();

        TimeSlotWithBookingsDTO nextSlot2DTO = TimeSlotWithBookingsDTO.builder()
                .slotTime(nextSlot2)
                .isCurrentSlot(false)
                .bookingCount(nextSlot2Bookings.size())
                .bookings(nextSlot2Bookings.stream().map(this::convertToDTO).collect(Collectors.toList()))
                .build();

        // Build final response
        CenterBookingSlotsDTO result = CenterBookingSlotsDTO.builder()
                .centerId(center.getId())
                .centerName(center.getCenterName())
                .date(date)
                .slots(List.of(currentSlotDTO, nextSlot1DTO, nextSlot2DTO))
                .totalTodayBookings(allTodayBookings.size())
                .build();

        log.debug("✅ Successfully built booking slots response with {} slots", result.getSlots().size());
        return result;
    }
}

