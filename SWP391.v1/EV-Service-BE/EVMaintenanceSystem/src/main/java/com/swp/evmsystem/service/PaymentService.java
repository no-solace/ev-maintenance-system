package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.PaymentRequestDTO;
import com.swp.evmsystem.dto.PaymentResponseDTO;
import com.swp.evmsystem.dto.PaymentStatsDTO;
import com.swp.evmsystem.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface PaymentService {
    
    /**
     * Create a new payment/invoice
     */
    PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO);
    
    /**
     * Get payment by ID
     */
    PaymentResponseDTO getPaymentById(Integer paymentId);
    
    /**
     * Get payment by invoice number
     */
    PaymentResponseDTO getPaymentByInvoiceNumber(String invoiceNumber);
    
    /**
     * Get all payments
     */
    List<PaymentResponseDTO> getAllPayments();
    
    /**
     * Get payments by status
     */
    List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status);
    
    /**
     * Search payments by keyword (customer name, phone, license plate, invoice number)
     */
    List<PaymentResponseDTO> searchPayments(String searchTerm);
    
    /**
     * Update payment status
     */
    PaymentResponseDTO updatePaymentStatus(Integer paymentId, PaymentStatus newStatus);
    
    /**
     * Mark payment as paid (cash received)
     */
    PaymentResponseDTO markAsPaid(Integer paymentId, String paymentMethod);
    
    /**
     * Mark payment as completed (bank transfer confirmed)
     */
    PaymentResponseDTO markAsCompleted(Integer paymentId);
    
    /**
     * Get payment statistics
     */
    PaymentStatsDTO getPaymentStatistics();
    
    /**
     * Get payments by date range
     */
    List<PaymentResponseDTO> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Create payment from booking (when booking is completed)
     */
    PaymentResponseDTO createPaymentFromBooking(Integer bookingId);
    
    /**
     * Create payment from reception (when reception is completed)
     */
    PaymentResponseDTO createPaymentFromReception(Integer receptionId);
    
    /**
     * Create booking deposit payment and return payment URL
     */
    Map<String, Object> createBookingDepositPayment(Integer bookingId);
}
