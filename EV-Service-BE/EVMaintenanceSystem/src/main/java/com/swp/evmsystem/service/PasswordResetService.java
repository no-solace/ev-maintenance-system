package com.swp.evmsystem.service;

import jakarta.mail.MessagingException;

public interface PasswordResetService {
    void sendOTPToEmail(String email) throws MessagingException;
    
    boolean verifyOTP(String email, String otpCode);
    
    void resetPassword(String email, String otpCode, String newPassword);
    
    void cleanupExpiredTokens();
}
