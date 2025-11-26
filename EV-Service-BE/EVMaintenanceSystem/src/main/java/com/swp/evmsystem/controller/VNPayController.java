package com.swp.evmsystem.controller;

import com.swp.evmsystem.service.VNPayService;
import com.swp.evmsystem.service.PaymentService;
import com.swp.evmsystem.service.BookingService;
import com.swp.evmsystem.dto.response.PaymentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * VNPay Controller
 * Handles VNPay payment API endpoints
 */
@RestController
@RequestMapping("/api/vnpay")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VNPayController {

    final private VNPayService vnPayService;
    final private PaymentService paymentService;
    final private BookingService bookingService;

    @PostMapping("/create-payment-url")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> createPaymentUrl(@RequestBody Map<String, Object> requestData) throws java.io.UnsupportedEncodingException {
        Long amount = ((Number) requestData.get("amount")).longValue();
        String orderInfo = (String) requestData.get("orderInfo");
        Long paymentId = requestData.get("paymentId") != null 
            ? ((Number) requestData.get("paymentId")).longValue() 
            : 0L;
        String invoiceNumber = (String) requestData.get("invoiceNumber");

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Số tiền không hợp lệ. VNPay không hỗ trợ thanh toán với số tiền 0đ hoặc âm."
            ));
        }
        if (invoiceNumber == null || invoiceNumber.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Mã hóa đơn không hợp lệ"
            ));
        }

        String paymentUrl = vnPayService.createPaymentUrl(amount, orderInfo, paymentId, invoiceNumber);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "paymentUrl", paymentUrl,
            "message", "Tạo liên kết thanh toán thành công"
        ));
    }

    /**
     * Handle VNPay return callback
     * GET /api/vnpay/return
     * This endpoint can be called by:
     * 1. VNPay directly (redirect from payment gateway)
     * 2. Frontend (to verify payment result)
     */
    @GetMapping("/return")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> handleReturn(@RequestParam Map<String, String> params) {
        try {
            System.out.println("🔵 VNPay return endpoint called with params: " + params.keySet());
            
            if (params.isEmpty()) {
                System.out.println("❌ No parameters received");
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false, 
                    "message", "Không nhận được thông tin từ VNPay"
                ));
            }
            
            Map<String, String> mutableParams = new HashMap<>(params);
            boolean isValid = vnPayService.validateSignature(new HashMap<>(mutableParams));
            
            System.out.println("🔐 Signature validation: " + (isValid ? "VALID" : "INVALID"));
            
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Chữ ký không hợp lệ"));
            }
            
            Map<String, Object> result = vnPayService.parseVNPayResponse(mutableParams);
            System.out.println("📊 Payment result: " + result);
            System.out.println("📝 Invoice number: " + result.get("invoiceNumber"));
            System.out.println("💳 Payment ID: " + result.get("paymentId"));
            
            if ((Boolean) result.get("success")) {
                String paymentIdStr = (String) result.get("paymentId");
                if (paymentIdStr != null) {
                    Integer paymentId = Integer.parseInt(paymentIdStr);
                    System.out.println("✅ Processing successful payment for ID: " + paymentId);
                    
                    // Get payment details BEFORE updating
                    PaymentResponseDTO paymentBefore = paymentService.getPaymentById(paymentId);
                    System.out.println("📋 Payment details:");
                    System.out.println("   - Invoice: " + paymentBefore.getInvoiceNumber());
                    System.out.println("   - BookingId: " + paymentBefore.getBookingId());
                    System.out.println("   - ReceptionId: " + paymentBefore.getReceptionId());
                    System.out.println("   - Amount: " + paymentBefore.getFinalAmount());
                    
                    paymentService.markAsPaid(paymentId, "VNPAY");
                    paymentService.markAsCompleted(paymentId);
                    PaymentResponseDTO payment = paymentService.getPaymentById(paymentId);
                    
                    // Only confirm booking deposit if this is a BOOKING DEPOSIT payment
                    // (has bookingId but NO receptionId)
                    if (payment.getBookingId() != null && payment.getReceptionId() == null) {
                        System.out.println("📝 ✅ This is a BOOKING DEPOSIT payment, confirming booking #" + payment.getBookingId());
                        bookingService.confirmBookingDeposit(payment.getBookingId());
                        System.out.println("✅ Booking confirmed successfully");
                    } else if (payment.getReceptionId() != null) {
                        System.out.println("🔧 ✅ This is a SERVICE payment for reception #" + payment.getReceptionId());
                        // Service payment - already handled in markAsCompleted
                    } else {
                        System.out.println("⚠️ WARNING: Payment has no bookingId or receptionId!");
                    }
                }
            } else {
                System.out.println("❌ Payment failed with response code: " + result.get("responseCode"));
            }
            
            // Return JSON response
            // Note: VNPay will redirect directly to frontend URLs configured in VNPayServiceImpl
            // This endpoint is called by frontend to verify/process the payment result
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ Error processing VNPay return: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false, 
                        "message", "Lỗi xử lý kết quả thanh toán: " + e.getMessage()
                    ));
        }
    }

    @GetMapping("/ipn")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> handleIPN(@RequestParam Map<String, String> params) {
        Map<String, String> mutableParams = new HashMap<>(params);
        boolean isValid = vnPayService.validateSignature(new HashMap<>(mutableParams));
        Map<String, Object> response = new HashMap<>();
        if (!isValid) {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Signature");
            return ResponseEntity.ok(response);
        }
        Map<String, Object> result = vnPayService.parseVNPayResponse(mutableParams);
        if ((Boolean) result.get("success")) {
            String paymentIdStr = (String) result.get("paymentId");
            if (paymentIdStr != null) {
                Integer paymentId = Integer.parseInt(paymentIdStr);
                paymentService.markAsPaid(paymentId, "VNPAY");
                paymentService.markAsCompleted(paymentId);
                PaymentResponseDTO payment = paymentService.getPaymentById(paymentId);
                
                // Only confirm booking deposit if this is a BOOKING DEPOSIT payment
                // (has bookingId but NO receptionId)
                if (payment.getBookingId() != null && payment.getReceptionId() == null) {
                    bookingService.confirmBookingDeposit(payment.getBookingId());
                }
            }
            response.put("RspCode", "00");
            response.put("Message", "Confirm Success");
        } else {
            response.put("RspCode", "01");
            response.put("Message", "Payment Failed");
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Query VNPay transaction status
     * POST /api/vnpay/query-transaction
     */
    @PostMapping("/query-transaction")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> queryTransaction(@RequestBody Map<String, String> requestData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Chức năng đang được phát triển");
        return ResponseEntity.ok(response);
    }

    /**
     * Refund VNPay transaction
     * POST /api/vnpay/refund
     */
    @PostMapping("/refund")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> refundTransaction(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Chức năng đang được phát triển");
        return ResponseEntity.ok(response);
    }
}
