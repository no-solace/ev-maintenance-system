package com.swp.evmsystem.service;

import com.swp.evmsystem.model.BookingEntity;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendOTPEmail(String toEmail, String otpCode) throws MessagingException;
    void sendBookingReceiptEmail(BookingEntity booking) throws MessagingException;
}
