package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.EmployeeDTO;
import com.swp.evmsystem.dto.request.BookingRequestDTO;
import com.swp.evmsystem.dto.response.BookingResponseDTO;
import com.swp.evmsystem.dto.response.BookingStatsDTO;
import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.dto.response.TimeSlotResponseDTO;
import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.entity.ServiceCenterEntity;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.BookingService;
import com.swp.evmsystem.service.ElectricVehicleService;
import com.swp.evmsystem.service.EmployeeService;
import com.swp.evmsystem.service.OfferTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {
    final private OfferTypeService offerTypeService;
    final private BookingService bookingService;
    final private ElectricVehicleService electricVehicleService;
    final private EmployeeService employeeService;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addBooking(
            @AuthenticationPrincipal UserEntityDetails userDetails,
            @Valid @RequestBody BookingRequestDTO request) {
        if (userDetails != null && !bookingService.isEVBelongToCustomer(request, userDetails)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("EV not belong to Customer");
        }
        BookingResponseDTO responseDTO = bookingService.createBooking(request);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/bookings/{centerId}/{date}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getAvailableTimeSlotByDate(@Valid
                                                        @PathVariable("date") LocalDate date,
                                                        @PathVariable("centerId") Integer centerId) {
        TimeSlotResponseDTO timeSlotResponseDTO = bookingService.getTimeSlots(centerId, date);
        return ResponseEntity.ok(timeSlotResponseDTO);
    }

    @GetMapping("/offer-types")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<OfferTypeDTO>> getAllOfferTypes() {
        return ResponseEntity.ok(offerTypeService.findAll());
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/{bookingId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN', 'CUSTOMER')")
    public ResponseEntity<?> getBookingById(@PathVariable Integer bookingId) {
        BookingResponseDTO booking = bookingService.getBookingById(bookingId);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Booking not found with ID: " + bookingId);
        }
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/bookings/{id}/request-cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> requestCancellation(@PathVariable Integer id, @RequestBody(required = false) String reason) {
        bookingService.requestCancellation(id, reason);
        return ResponseEntity.ok("Cancellation request submitted, awaiting staff approval");
    }

    @PutMapping("/bookings/{id}/approve-cancel")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> approveCancellation(@PathVariable Integer id) {
        bookingService.approveCancellation(id);
        return ResponseEntity.ok("Cancellation approved successfully");
    }

    @PutMapping("/bookings/{id}/reject-cancel")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> rejectCancellation(@PathVariable Integer id, @RequestBody(required = false) String reason) {
        bookingService.rejectCancellation(id, reason);
        return ResponseEntity.ok("Cancellation rejected");
    }

    @PutMapping("/bookings/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id, @RequestBody(required = false) String reason) {
        // Direct cancel for PENDING_PAYMENT or staff override
        bookingService.cancelBooking(id, reason);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    @GetMapping("/bookings/status/{status}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByStatus(@PathVariable String status) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    // ======================
    // STAFF WORKFLOW ENDPOINTS
    // ======================
    
    /**
     * Reschedule a booking
     * @param bookingId Booking ID
     * @param request New booking date and time
     * @return Updated booking
     */
    @PutMapping("/bookings/{bookingId}/reschedule")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> rescheduleBooking(
            @PathVariable Integer bookingId,
            @RequestBody BookingRequestDTO request) {
        try {
            BookingResponseDTO booking = bookingService.rescheduleBooking(bookingId, request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to reschedule booking: " + e.getMessage());
        }
    }

    @GetMapping("/bookings/statistics")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BookingStatsDTO> getBookingStatistics() {
        BookingStatsDTO stats = bookingService.getBookingStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/bookings/vehicle/{vehicleId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponseDTO>> getVehicleBookings(@PathVariable Integer vehicleId) {
        List<BookingResponseDTO> bookings = bookingService.getVehicleBookings(vehicleId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/customer/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        if (userDetails == null || userDetails.userEntity() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Integer customerId = userDetails.userEntity().getId();
        List<BookingResponseDTO> bookings = bookingService.getCustomerBookings(customerId);
        return ResponseEntity.ok(bookings);
    }
}
