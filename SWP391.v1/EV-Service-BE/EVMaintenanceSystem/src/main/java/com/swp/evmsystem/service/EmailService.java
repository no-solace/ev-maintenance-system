package com.swp.evmsystem.service;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendOTPEmail(String toEmail, String otpCode) throws MessagingException;
}
