package com.swp.evmsystem.controller;

import com.swp.evmsystem.constants.BookingConstants;
import com.swp.evmsystem.dto.request.BookingRequest;
import com.swp.evmsystem.dto.response.BookingResponseDTO;
import com.swp.evmsystem.dto.response.BookingStatsDTO;
import com.swp.evmsystem.dto.response.CenterBookingSlotsDTO;
import com.swp.evmsystem.dto.response.TimeSlotResponseDTO;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.BookingService;
import com.swp.evmsystem.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    
    private final BookingService bookingService;
    final private PaymentService paymentService;

    /**
     * Tạo booking
     */
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createBooking(
            @AuthenticationPrincipal UserEntityDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        BookingResponseDTO response = bookingService.createBooking(request, userDetails);
        return ResponseEntity.created(null).body(response);
    }

    /**
     * Lấy các slot của trung tâm theo ngày
     */
    @GetMapping("/{centerId}/{date}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getAvailableTimeSlots(
            @PathVariable Integer centerId,
            @PathVariable LocalDate date) {
        TimeSlotResponseDTO response = bookingService.getTimeSlotsByCenterIdAndDate(centerId, date);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả booking
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(@AuthenticationPrincipal UserEntityDetails userDetails) {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings(userDetails.getCenterId());
        return ResponseEntity.ok(bookings);
    }

    /**
     * Lấy booking theo Id
     */
    @GetMapping("/{bookingId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN', 'CUSTOMER')")
    public ResponseEntity<?> getBookingById(@PathVariable Integer bookingId) {
        BookingResponseDTO booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Yêu cầu hủy booking
     */
    @PutMapping("/{id}/request-cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> requestCancellation(
            @PathVariable Integer id,
            @RequestBody(required = false) String reason) {
        bookingService.requestCancellation(id, reason);
        return ResponseEntity.ok("Cancellation request submitted");
    }

    /**
     * Chấp nhận hủy booking
     */
    @PutMapping("/{id}/approve-cancel")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> approveCancellation(@PathVariable Integer id) {
        bookingService.approveCancellation(id);
        return ResponseEntity.ok("Cancellation approved");
    }

    /**
     * Từ chối hủy booking
     */
    @PutMapping("/{id}/reject-cancel")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> rejectCancellation(
            @PathVariable Integer id,
            @RequestBody(required = false) String reason) {
        bookingService.rejectCancellation(id, reason);
        return ResponseEntity.ok("Cancellation rejected");
    }

    /**
     * Hủy booking trực tiếp
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Integer id,
            @RequestBody(required = false) String reason) {
        bookingService.cancelBooking(id, reason);
        return ResponseEntity.ok("Booking cancelled");
    }

    /**
     * Lấy booking theo status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByStatus(@PathVariable String status) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByStatus(BookingStatus.valueOf(status));
        return ResponseEntity.ok(bookings);
    }

    /**
     * Cập nhật thời gian booking
     */
    @PutMapping("/{bookingId}/reschedule")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> rescheduleBooking(
            @PathVariable Integer bookingId,
            @Valid @RequestBody BookingRequest request) {
        BookingResponseDTO booking = bookingService.rescheduleBooking(bookingId, request);
        return ResponseEntity.ok(booking);
    }

    /**
     * Phân tích số liệu booking
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<BookingStatsDTO> getBookingStatistics() {
        BookingStatsDTO stats = bookingService.getBookingStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy booking theo xe
     */
    @GetMapping("/vehicles/{vehicleId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByVehicleId(@PathVariable Integer vehicleId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByVehicleId(vehicleId);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get booking slots with full details for authenticated staff's center
     * Returns current slot + next 2 slots with all booking information
     * Staff can only see bookings from their own center
     */
    @GetMapping("/my-center/slots")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<CenterBookingSlotsDTO> getMyBookingSlots(
            @AuthenticationPrincipal UserEntityDetails userDetails,
            @RequestParam(required = false) LocalDate date) {
        log.info("📍 GET /my-center/slots called by user: {}", userDetails.getUsername());
        
        // Get centerId from authenticated user
        Integer centerId = userDetails.getCenterId();
        log.info("🏢 User centerId: {}", centerId);
        
        if (centerId == null) {
            log.warn("⚠️ User does not have centerId - returning 400");
            return ResponseEntity.badRequest().build();
        }
        
        // If no date provided, use today
        LocalDate targetDate = date != null ? date : LocalDate.now();
        log.info("📅 Fetching slots for date: {}", targetDate);
        
        CenterBookingSlotsDTO slots = bookingService.getBookingSlotsByCenter(centerId, targetDate);
        log.info("✅ Returning booking slots with {} total bookings", slots.getTotalTodayBookings());
        
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/{bookingId}/create-deposit-payment")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createDepositPayment(@PathVariable Integer bookingId) {
        Map<String, Object> response = paymentService.createBookingDepositPayment(bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/deposit-policy")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getDepositPolicy() {
        return ResponseEntity.ok(java.util.Map.of(
                "depositAmount", BookingConstants.DEPOSIT_AMOUNT,
                "holdTimeMinutes", BookingConstants.HOLD_TIME_MINUTES,
                "policy", BookingConstants.DEPOSIT_POLICY
        ));
    }
}
