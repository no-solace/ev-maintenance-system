package com.swp.evmsystem.service;


import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface VNPayService {
    String createPaymentUrl(long amount, String orderInfo, Long paymentId, String invoiceNumber) 
            throws UnsupportedEncodingException;
    
    boolean validateSignature(Map<String, String> params);
    
    Map<String, Object> parseVNPayResponse(Map<String, String> params);
}
