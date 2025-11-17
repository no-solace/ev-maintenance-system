package com.swp.evmsystem.controller;

import com.swp.evmsystem.service.VNPayService;
import com.swp.evmsystem.service.PaymentService;
import com.swp.evmsystem.service.BookingService;
import com.swp.evmsystem.dto.PaymentResponseDTO;
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
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private BookingService bookingService;

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
                "message", "Số tiền không hợp lệ"
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
     */
    @GetMapping("/return")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> handleReturn(@RequestParam Map<String, String> params) {
        Map<String, String> mutableParams = new HashMap<>(params);
        boolean isValid = vnPayService.validateSignature(new HashMap<>(mutableParams));
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Chữ ký không hợp lệ"));
        }
        Map<String, Object> result = vnPayService.parseVNPayResponse(mutableParams);
        if ((Boolean) result.get("success")) {
            String paymentIdStr = (String) result.get("paymentId");
            if (paymentIdStr != null) {
                Integer paymentId = Integer.parseInt(paymentIdStr);
                paymentService.markAsPaid(paymentId, "VNPAY");
                paymentService.markAsCompleted(paymentId);
                PaymentResponseDTO payment = paymentService.getPaymentById(paymentId);
                if (payment.getBookingId() != null) {
                    bookingService.confirmBookingDeposit(payment.getBookingId());
                }
            }
        }
        return ResponseEntity.ok(result);
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
                if (payment.getBookingId() != null) {
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
