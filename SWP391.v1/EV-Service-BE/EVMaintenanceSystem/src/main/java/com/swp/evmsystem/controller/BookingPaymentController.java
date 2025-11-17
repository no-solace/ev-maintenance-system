package com.swp.evmsystem.controller;

import com.swp.evmsystem.constants.BookingConstants;
import com.swp.evmsystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for booking deposit payments
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingPaymentController {
    
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/bookings/{bookingId}/create-deposit-payment")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createDepositPayment(@PathVariable Integer bookingId) {
        Map<String, Object> response = paymentService.createBookingDepositPayment(bookingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookings/deposit-policy")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getDepositPolicy() {
        return ResponseEntity.ok(java.util.Map.of(
                "depositAmount", BookingConstants.DEPOSIT_AMOUNT,
                "holdTimeMinutes", BookingConstants.HOLD_TIME_MINUTES,
                "policy", BookingConstants.DEPOSIT_POLICY
        ));
    }
}