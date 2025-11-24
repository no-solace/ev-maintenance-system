package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.PaymentStatsDTO;
import com.swp.evmsystem.dto.request.PaymentRequestDTO;
import com.swp.evmsystem.dto.request.UpdateStatusRequest;
import com.swp.evmsystem.dto.response.PaymentResponseDTO;
import com.swp.evmsystem.enums.PaymentStatus;
import com.swp.evmsystem.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    final private PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequestDTO requestDTO) {
        PaymentResponseDTO response = paymentService.createPayment(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        List<PaymentResponseDTO> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getPaymentById(@PathVariable Integer id) {
        PaymentResponseDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/invoice/{invoiceNumber}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getPaymentByInvoiceNumber(@PathVariable String invoiceNumber) {
        PaymentResponseDTO payment = paymentService.getPaymentByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> getPaymentsByStatus(@PathVariable String status) {
        PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
        List<PaymentResponseDTO> payments = paymentService.getPaymentsByStatus(paymentStatus);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<PaymentResponseDTO>> searchPayments(@RequestParam String q) {
        List<PaymentResponseDTO> payments = paymentService.searchPayments(q);
        return ResponseEntity.ok(payments);
    }


    @PostMapping("/{id}/mark-paid")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> markPaymentAsPaid(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, String> body) {
        String paymentMethod = body != null ? body.get("paymentMethod") : "CASH";
        PaymentResponseDTO payment = paymentService.markAsPaid(id, paymentMethod);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/{id}/mark-completed")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> markPaymentAsCompleted(@PathVariable Integer id) {
        PaymentResponseDTO payment = paymentService.markAsCompleted(id);
        return ResponseEntity.ok(payment);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Integer id,
            @RequestBody UpdateStatusRequest request) {
        PaymentStatus newStatus = PaymentStatus.valueOf(request.getStatus().toUpperCase());
        PaymentResponseDTO payment = paymentService.updatePaymentStatus(id, newStatus);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<PaymentStatsDTO> getPaymentStatistics() {
        PaymentStatsDTO stats = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<PaymentResponseDTO> payments = paymentService.getPaymentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/from-reception/{receptionId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> createPaymentFromReception(@PathVariable Integer receptionId) {
        PaymentResponseDTO payment = paymentService.createPaymentFromReception(receptionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

}
