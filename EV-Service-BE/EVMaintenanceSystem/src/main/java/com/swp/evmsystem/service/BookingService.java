package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.BookingRequest;
import com.swp.evmsystem.dto.response.BookingResponseDTO;
import com.swp.evmsystem.dto.response.BookingStatsDTO;
import com.swp.evmsystem.dto.response.CenterBookingSlotsDTO;
import com.swp.evmsystem.dto.response.TimeSlotResponseDTO;
import com.swp.evmsystem.model.BookingEntity;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.security.UserEntityDetails;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequest request, Integer customerId);

    BookingEntity createBookingEntity(BookingRequest request, Integer customerId);

    List<BookingResponseDTO> getAllBookings(Integer centerId);

    List<BookingEntity> getAllBookingEntities(Integer centerId);

    BookingResponseDTO getBookingById(Integer bookingId);

    BookingEntity getBookingEntityById(Integer bookingId);

    BookingEntity rescheduleBookingEntity(Integer bookingId, BookingRequest request);

    BookingResponseDTO rescheduleBooking(Integer bookingId, BookingRequest request);

    List<BookingEntity> getBookingEntitiesByStatus(BookingStatus status);

    List<BookingResponseDTO> getBookingsByStatus(BookingStatus status);

    List<BookingEntity> getBookingEntitiesByVehicleId(Integer vehicleId);

    List<BookingResponseDTO> getBookingsByVehicleId(Integer vehicleId);

    List<BookingEntity> getBookingEntitiesByCustomerId(Integer customerId);

    List<BookingResponseDTO> getBookingsByCustomerId(Integer customerId);

    BookingStatsDTO getBookingStatistics();

    TimeSlotResponseDTO getTimeSlotsByCenterIdAndDate(int centerId, LocalDate date);

    @Scheduled(fixedRate = 300000)
    @Transactional
    void cancelExpiredUnpaidBookings();

    void confirmBookingDeposit(Integer bookingId);

    void requestCancellation(Integer bookingId, String reason);

    void approveCancellation(Integer bookingId);

    void rejectCancellation(Integer bookingId, String reason);

    void cancelBooking(Integer bookingId, String reason);

    /**
     * Get bookings grouped by time slots for a specific center on a specific date
     * Returns current slot + next 2 slots with full booking details
     */
    CenterBookingSlotsDTO getBookingSlotsByCenter(Integer centerId, LocalDate date);
}
