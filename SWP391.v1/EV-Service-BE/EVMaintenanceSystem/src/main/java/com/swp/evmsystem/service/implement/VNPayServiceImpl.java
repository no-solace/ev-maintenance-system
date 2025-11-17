package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.config.VNPayConfig;
import com.swp.evmsystem.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * VNPay Service
 * Handles VNPay payment processing
 */
@Service
public class VNPayServiceImpl implements VNPayService {

    @Autowired
    private VNPayConfig vnPayConfig;

    /**
     * Create VNPay payment URL
     * 
     * @param amount Payment amount in VND (will be multiplied by 100 for VNPay)
     * @param orderInfo Order description
     * @param paymentId Payment ID from your system
     * @param invoiceNumber Invoice number
     * @return Payment URL to redirect user
     */
    public String createPaymentUrl(long amount, String orderInfo, Long paymentId, String invoiceNumber) 
            throws UnsupportedEncodingException {
        
        // Convert amount to VNPay format (multiply by 100)
        long vnpAmount = amount * 100;
        
        // Create date format
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String vnpCreateDate = formatter.format(cld.getTime());
        
        // Add 15 minutes for expiry
        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        
        // Build VNPay parameters
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(vnpAmount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_BankCode", ""); // Empty for all banks
        
        // Generate unique transaction reference
        String vnpTxnRef = invoiceNumber + "_" + paymentId + "_" + System.currentTimeMillis();
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other"); // Bill payment
        vnpParams.put("vnp_Locale", "vn");
        // Determine return URL based on invoice number prefix
        // If invoice starts with "HD" (Hóa Đơn), it's a staff payment (service invoice)
        // Otherwise, it's a customer booking deposit
        String returnUrl;
        if (invoiceNumber != null && invoiceNumber.startsWith("HD")) {
            // Staff payment - return to staff page
            returnUrl = vnPayConfig.getVnpStaffReturnUrl();
            System.out.println("✅ Using STAFF return URL for invoice " + invoiceNumber + ": " + returnUrl);
        } else {
            // Customer booking deposit - return to customer success page
            returnUrl = vnPayConfig.getVnpReturnUrl();
            System.out.println("✅ Using CUSTOMER return URL for invoice " + invoiceNumber + ": " + returnUrl);
        }
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", "127.0.0.1"); // Should be real client IP
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);
        
        // Build query string
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        
        String queryUrl = query.toString();
        String vnpSecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + queryUrl;
        
        return paymentUrl;
    }

    /**
     * Validate VNPay callback signature
     * 
     * @param params Query parameters from VNPay
     * @return true if signature is valid
     */
    public boolean validateSignature(Map<String, String> params) {
        String vnpSecureHash = params.get("vnp_SecureHash");
        if (vnpSecureHash == null) {
            return false;
        }
        
        // Remove signature params
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        
        // Build hash data
        String signData = vnPayConfig.buildQueryString(params);
        String calculatedHash = vnPayConfig.hmacSHA512(vnPayConfig.getVnpHashSecret(), signData);
        
        return vnpSecureHash.equalsIgnoreCase(calculatedHash);
    }

    /**
     * Parse VNPay response
     * 
     * @param params Query parameters from VNPay
     * @return Map with parsed data
     */
    public Map<String, Object> parseVNPayResponse(Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String txnRef = params.get("vnp_TxnRef");
        String amount = params.get("vnp_Amount");
        String bankCode = params.get("vnp_BankCode");
        String payDate = params.get("vnp_PayDate");
        
        // Check if payment was successful
        boolean isSuccess = "00".equals(responseCode);
        
        result.put("success", isSuccess);
        result.put("responseCode", responseCode);
        result.put("transactionNo", transactionNo);
        result.put("txnRef", txnRef);
        result.put("amount", amount != null ? Long.parseLong(amount) : 0L);
        result.put("bankCode", bankCode);
        result.put("payDate", payDate);
        result.put("message", getResponseMessage(responseCode));
        
        // Parse invoice number and payment ID from txnRef
        // Format: {invoiceNumber}_{paymentId}_{timestamp}
        // Need to split from right to handle invoice numbers with underscores
        if (txnRef != null && txnRef.contains("_")) {
            int lastUnderscore = txnRef.lastIndexOf("_");
            if (lastUnderscore > 0) {
                String beforeTimestamp = txnRef.substring(0, lastUnderscore);
                int secondLastUnderscore = beforeTimestamp.lastIndexOf("_");
                if (secondLastUnderscore > 0) {
                    String invoiceNumber = beforeTimestamp.substring(0, secondLastUnderscore);
                    String paymentId = beforeTimestamp.substring(secondLastUnderscore + 1);
                    result.put("invoiceNumber", invoiceNumber);
                    result.put("paymentId", paymentId);
                }
            }
        }
        
        return result;
    }

    /**
     * Get response message from response code
     */
    private String getResponseMessage(String responseCode) {
        switch (responseCode) {
            case "00": return "Giao dịch thành công";
            case "07": return "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)";
            case "09": return "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng";
            case "10": return "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11": return "Giao dịch không thành công do: Đã hết hạn chờ thanh toán";
            case "12": return "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa";
            case "13": return "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)";
            case "24": return "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            case "51": return "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch";
            case "65": return "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày";
            case "75": return "Ngân hàng thanh toán đang bảo trì";
            case "79": return "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định";
            default: return "Lỗi không xác định";
        }
    }
}
