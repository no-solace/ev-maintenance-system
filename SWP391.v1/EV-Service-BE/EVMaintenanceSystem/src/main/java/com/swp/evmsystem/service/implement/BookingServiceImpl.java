package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.request.BookingRequestDTO;
import com.swp.evmsystem.dto.response.BookingResponseDTO;
import com.swp.evmsystem.dto.response.BookingStatsDTO;
import com.swp.evmsystem.dto.response.TimeSlotDTO;
import com.swp.evmsystem.dto.response.TimeSlotResponseDTO;
import com.swp.evmsystem.entity.*;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.enums.EvMaintenanceStatus;
import com.swp.evmsystem.mapper.ServiceCenterMapper;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Slf4j
@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ElectricVehicleRepository vehicleRepository;
    @Autowired
    private ServiceCenterRepository centerRepository;
    @Autowired
    private OfferTypeRepository offerTypeRepository;
    @Autowired
    private MaintenancePackageRepository maintenancePackageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServiceCenterMapper serviceCenterMapper;

    @Override
    public synchronized BookingResponseDTO createBooking(BookingRequestDTO request) {
        ElectricVehicleEntity electricVehicle = vehicleRepository.findById(request.getEVId()).get();
        ServiceCenterEntity serviceCenter = centerRepository.findById(request.getCenterId()).get();
        LocalDate bookingDate = request.getBookingDate();
        LocalTime bookingTime = request.getBookingTime();

        // CRITICAL: Check slot availability FIRST to prevent overbooking
        long currentBookingCount = bookingRepository.countBookingsAtTime(
                serviceCenter.getId(),
                bookingDate, 
                bookingTime
        );
        
        if (currentBookingCount >= serviceCenter.getMaxCapacity()) {
            log.warn("Time slot full - Center: {}, Date: {}, Time: {}, Current: {}, Max: {}",
                    serviceCenter.getCenterName(), bookingDate, bookingTime, 
                    currentBookingCount, serviceCenter.getMaxCapacity());
            throw new RuntimeException("This time slot is full. Please select another time.");
        }

        // Check if vehicle is already booked or in service
        if (electricVehicle.getMaintenanceStatus() == EvMaintenanceStatus.BOOKED) {
            throw new RuntimeException("This vehicle already has a pending booking");
        }
        if (electricVehicle.getMaintenanceStatus() == EvMaintenanceStatus.IN_SERVICE) {
            throw new RuntimeException("This vehicle is currently in service");
        }

        // Determine customer info (fallback to vehicle owner if request fields are missing)
        CustomerEntity owner = electricVehicle.getOwner();
        String reqName = request.getCustomerName();
        String reqPhone = request.getCustomerPhone();
        String reqEmail = request.getCustomerEmail();
        String reqAddress = request.getCustomerAddress();

        log.debug("Processing booking request - EV: {}, Center: {}, Date: {}, Time: {}",
                request.getEVId(), request.getCenterId(), bookingDate, bookingTime);

        // Convert empty strings to null for optional fields
        String customerName = (reqName != null && !reqName.isBlank()) ? reqName : (owner != null ? owner.getFullName() : null);
        String customerPhone = (reqPhone != null && !reqPhone.isBlank()) ? reqPhone : (owner != null ? owner.getPhone() : null);
        
        // Email and Address are optional - store as null if not provided
        String customerEmail = (reqEmail != null && !reqEmail.isBlank()) ? reqEmail : null;
        String customerAddress = (reqAddress != null && !reqAddress.isBlank()) ? reqAddress : null;

        BookingEntity savedBooking = BookingEntity.builder()
                .vehicle(electricVehicle)
                .center(serviceCenter)
                .bookingDate(bookingDate)
                .bookingTime(bookingTime)
                .status(BookingStatus.PENDING_PAYMENT)  // Waiting for deposit
                .notes(request.getNotes())
                .customerName(customerName)
                .customerPhone(customerPhone)
                .customerEmail(customerEmail)
                .customerAddress(customerAddress)
                .createdAt(java.time.LocalDateTime.now())
                .build();
        
        // CRITICAL: Save the booking to database
        savedBooking = bookingRepository.save(savedBooking);
        
        // Update vehicle status to BOOKED to prevent double booking
        electricVehicle.setMaintenanceStatus(EvMaintenanceStatus.BOOKED);
        vehicleRepository.save(electricVehicle);

        log.info("Booking created successfully - ID: {}, Center: {}, Date: {}, Vehicle status: BOOKED",
                savedBooking.getBookingId(), serviceCenter.getCenterName(), bookingDate);

        return BookingResponseDTO.builder()
                .bookingId(savedBooking.getBookingId())
                .center(serviceCenter.getCenterName())
                .address(serviceCenter.getCenterAddress().toString())
                .date(bookingDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                .time(bookingTime.format(DateTimeFormatter.ofPattern("HH:mm")))
                .bookingDate(bookingDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .bookingTime(bookingTime.format(DateTimeFormatter.ofPattern("HH:mm")))
                .eVModel(electricVehicle.getModel().getModelName())
                .vehicleMake(electricVehicle.getModel().getManufacturer() != null ? electricVehicle.getModel().getManufacturer() : "EV")
                .vehicleModel(electricVehicle.getModel().getModelName())
                .licensePlate(electricVehicle.getLicensePlate())
                .vin(electricVehicle.getVin())
                .hasWarranty(electricVehicle.getHasWarranty())
                .warrantyEndDate(electricVehicle.getWarrantyEndDate() != null
                        ? electricVehicle.getWarrantyEndDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                        : null)
                .customerName(savedBooking.getCustomerName())
                .customerEmail(savedBooking.getCustomerEmail())
                .customerPhone(savedBooking.getCustomerPhone())
                .customerAddress(savedBooking.getCustomerAddress())
                .notes(request.getNotes())
                .status(BookingStatus.PENDING_PAYMENT.name())
                .createdAt(savedBooking.getCreatedAt())
                .build();

    }

    @Override
    public boolean isEVBelongToCustomer(BookingRequestDTO request, UserEntityDetails user) {
        Integer eVId = request.getEVId();
        CustomerEntity owner = (CustomerEntity) user.userEntity();

        return vehicleRepository.existsElectricVehicleEntityByIdAndOwner_Id(eVId, owner.getId());
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        List<BookingEntity> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO getBookingById(Integer bookingId) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElse(null);

        if (booking == null) {
            return null;
        }

        return convertToDTO(booking);
    }

    private BookingResponseDTO convertToDTO(BookingEntity booking) {
        ElectricVehicleEntity vehicle = booking.getVehicle();
        EvModelEntity model = vehicle.getModel();

        return BookingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                .center(booking.getCenter().getCenterName())
                .address(booking.getCenter().getCenterAddress().toString())
                .date(booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                .time(booking.getBookingTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .bookingDate(booking.getBookingDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .bookingTime(booking.getBookingTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .eVModel(model.getModelName())
                .vehicleMake(model.getManufacturer() != null ? model.getManufacturer() : "EV")
                .vehicleModel(model.getModelName())
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


    @Override
    public void requestCancellation(Integer bookingId, String reason) {
        log.info("Customer requesting cancellation for booking: {}", bookingId);
        
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Can only request cancellation for UPCOMING bookings (paid but not yet started)
        if (booking.getStatus() != BookingStatus.UPCOMING) {
            throw new RuntimeException("Can only request cancellation for confirmed bookings");
        }

        booking.setStatus(BookingStatus.CANCELLATION_REQUESTED);
        if (reason != null && !reason.isEmpty()) {
            booking.setNotes((booking.getNotes() != null ? booking.getNotes() + "\n" : "") + "Cancellation request reason: " + reason);
        }

        bookingRepository.save(booking);
        log.info("Cancellation requested for booking {}, awaiting staff approval", bookingId);
    }

    @Override
    public void approveCancellation(Integer bookingId) {
        log.info("Staff approving cancellation for booking: {}", bookingId);
        
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.CANCELLATION_REQUESTED) {
            throw new RuntimeException("No pending cancellation request for this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        
        // Free up the vehicle
        ElectricVehicleEntity vehicle = booking.getVehicle();
        vehicle.setMaintenanceStatus(EvMaintenanceStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        bookingRepository.save(booking);
        log.info("Cancellation approved for booking {}, vehicle freed", bookingId);
        
        // TODO: Process refund here if payment was made
    }

    @Override
    public void rejectCancellation(Integer bookingId, String reason) {
        log.info("Staff rejecting cancellation for booking: {}", bookingId);
        
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.CANCELLATION_REQUESTED) {
            throw new RuntimeException("No pending cancellation request for this booking");
        }

        // Revert back to UPCOMING status
        booking.setStatus(BookingStatus.UPCOMING);
        if (reason != null && !reason.isEmpty()) {
            booking.setNotes((booking.getNotes() != null ? booking.getNotes() + "\n" : "") + "Cancellation rejected: " + reason);
        }

        bookingRepository.save(booking);
        log.info("Cancellation rejected for booking {}, status reverted to UPCOMING", bookingId);
    }

    @Override
    public void cancelBooking(Integer bookingId, String reason) {
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel a " + booking.getStatus() + " booking");
        }

        // Direct cancellation (for PENDING_PAYMENT bookings or staff override)
        booking.setStatus(BookingStatus.CANCELLED);
        if (reason != null && !reason.isEmpty()) {
            booking.setNotes((booking.getNotes() != null ? booking.getNotes() + "\n" : "") + "Cancellation reason: " + reason);
        }

        // Free up the vehicle
        ElectricVehicleEntity vehicle = booking.getVehicle();
        vehicle.setMaintenanceStatus(EvMaintenanceStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        bookingRepository.save(booking);
    }

    @Override
    public java.util.List<BookingResponseDTO> getBookingsByStatus(String status) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        java.util.List<BookingEntity> bookings = bookingRepository.findByStatus(bookingStatus);
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getVehicleBookings(Integer vehicleId) {
        log.debug("Fetching bookings for vehicle: {}", vehicleId);
        java.util.List<BookingEntity> bookings = bookingRepository.findByVehicle_Id(vehicleId);
        log.debug("Found {} bookings for vehicle {}", bookings.size(), vehicleId);

        return bookings.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<BookingResponseDTO> getCustomerBookings(Integer customerId) {
        log.debug("Fetching bookings for customer: {}", customerId);
        java.util.List<BookingEntity> bookings = bookingRepository.findByVehicle_Owner_Id(customerId);
        log.debug("Found {} bookings for customer {}", bookings.size(), customerId);

        return bookings.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

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

    @Override
    public void confirmBookingDeposit(Integer bookingId) {
        log.info("Confirming booking deposit for booking: {}", bookingId);

        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
            booking.setStatus(BookingStatus.UPCOMING);
            bookingRepository.save(booking);
            log.info("Booking {} payment confirmed, status changed to UPCOMING", bookingId);
        } else {
            log.warn("Booking {} is already in status: {}, expected PENDING_PAYMENT", bookingId, booking.getStatus());
        }
    }

    @Override
    public TimeSlotResponseDTO getTimeSlots(int centerId, LocalDate date) {
        // 1. Lấy thông tin center
        ServiceCenterEntity center = centerRepository.findById(centerId)
                .orElseThrow(() -> new EntityNotFoundException("ServiceCenter not found with id: " + centerId));

        // 2. Lấy số bookings cho từng slot
        List<BookingRepository.BookingCountProjection> bookingCounts =
                bookingRepository.findByCenterAndBookingDate(center, date);

        // Convert to Map để lookup nhanh
        Map<LocalTime, Integer> bookingCountMap = bookingCounts.stream()
                .collect(Collectors.toMap(
                        BookingRepository.BookingCountProjection::getTime,
                        BookingRepository.BookingCountProjection::getCount
                ));

        // 3. Tạo TimeSlot objects
        LocalTime start = center.getStartTime();
        LocalTime end = center.getEndTime();
        int slotMinutes = 60; // độ dài mỗi slot (1h)

        List<TimeSlotDTO> slots = Stream
                .iterate(start, time -> time.isBefore(end), time -> time.plusMinutes(slotMinutes))
                .map(time -> {
                    int numOfBookings = bookingCountMap.getOrDefault(time, 0);

                    return TimeSlotDTO.builder()
                            .date(date)
                            .time(time)
                            .centerId(centerId)
                            .numOfBookings(numOfBookings)
                            .maxCapacity(center.getMaxCapacity())
                            .available(numOfBookings < center.getMaxCapacity())
                            .build();
                })
                .collect(Collectors.toList());

        // 4. Build response
        return TimeSlotResponseDTO.builder()
                .date(date)
                .center(serviceCenterMapper.toDTO(center))
                .slots(slots)
                .build();
    }
    
    @Override
    public BookingResponseDTO rescheduleBooking(Integer bookingId, BookingRequestDTO request) {
        log.info("Rescheduling booking {}", bookingId);
        
        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        
        // Only allow rescheduling for certain statuses
        if (booking.getStatus() == BookingStatus.COMPLETED || 
            booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule a " + booking.getStatus() + " booking");
        }
        
        LocalDate newDate = request.getBookingDate();
        LocalTime newTime = request.getBookingTime();
        
        // Check if new time slot is available
        ServiceCenterEntity center = booking.getCenter();
        long currentBookingCount = bookingRepository.countBookingsAtTime(
                center.getId(),
                newDate,
                newTime
        );
        
        if (currentBookingCount >= center.getMaxCapacity()) {
            throw new RuntimeException("The selected time slot is full. Please choose another time.");
        }
        
        // Update booking date and time
        booking.setBookingDate(newDate);
        booking.setBookingTime(newTime);
        
        BookingEntity savedBooking = bookingRepository.save(booking);
        log.info("Booking {} rescheduled to {} at {}", bookingId, newDate, newTime);
        
        return convertToDTO(savedBooking);
    }

}
