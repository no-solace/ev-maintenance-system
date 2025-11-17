package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.BookingRequestDTO;
import com.swp.evmsystem.dto.response.BookingResponseDTO;
import com.swp.evmsystem.dto.response.BookingStatsDTO;
import com.swp.evmsystem.dto.response.TimeSlotResponseDTO;
import com.swp.evmsystem.security.UserEntityDetails;

import java.time.LocalDate;
import java.util.List;


public interface BookingService {
    // Create and retrieve bookings
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO);

    boolean isEVBelongToCustomer(BookingRequestDTO request, UserEntityDetails user);

    List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO getBookingById(Integer bookingId);

    // Booking status management
    void confirmBookingDeposit(Integer bookingId);

    void requestCancellation(Integer bookingId, String reason);
    
    void approveCancellation(Integer bookingId);
    
    void rejectCancellation(Integer bookingId, String reason);

    void cancelBooking(Integer bookingId, String reason);

    BookingResponseDTO rescheduleBooking(Integer bookingId, BookingRequestDTO request);

    List<BookingResponseDTO> getBookingsByStatus(String status);

    List<BookingResponseDTO> getVehicleBookings(Integer vehicleId);

    List<BookingResponseDTO> getCustomerBookings(Integer customerId);

    BookingStatsDTO getBookingStatistics();

    TimeSlotResponseDTO getTimeSlots(int centerId, LocalDate date);
}
