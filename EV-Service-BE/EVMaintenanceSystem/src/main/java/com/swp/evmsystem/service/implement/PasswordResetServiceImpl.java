package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.model.UserEntity;
import com.swp.evmsystem.repository.UserRepository;
import com.swp.evmsystem.service.EmailService;
import com.swp.evmsystem.service.PasswordResetService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {
    
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${otp.expiration.minutes:5}")
    private int otpExpirationMinutes;
    
    @Value("${otp.length:6}")
    private int otpLength;
    
    private static final String OTP_PREFIX = "otp:";
    private static final String OTP_VERIFIED_PREFIX = "otp:verified:";

    @Override
    public void sendOTPToEmail(String email) throws MessagingException {
        // Verify user exists
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        
        // Generate OTP
        String otpCode = generateOTP();
        
        // Store OTP in Redis with TTL
        String redisKey = OTP_PREFIX + email;
        redisTemplate.opsForValue().set(redisKey, otpCode, otpExpirationMinutes, TimeUnit.MINUTES);
        
        log.info("OTP stored in Redis for email: {} with TTL: {} minutes", email, otpExpirationMinutes);
        
        // Send OTP via email
        emailService.sendOTPEmail(email, otpCode);
    }

    @Override
    public boolean verifyOTP(String email, String otpCode) {
        String redisKey = OTP_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(redisKey);
        
        if (storedOtp == null) {
            log.warn("OTP not found or expired for email: {}", email);
            return false;
        }
        
        boolean isValid = storedOtp.equals(otpCode);
        
        if (isValid) {
            // Mark OTP as verified (store for password reset)
            String verifiedKey = OTP_VERIFIED_PREFIX + email;
            redisTemplate.opsForValue().set(verifiedKey, otpCode, otpExpirationMinutes, TimeUnit.MINUTES);
            log.info("OTP verified successfully for email: {}", email);
        } else {
            log.warn("Invalid OTP attempt for email: {}", email);
        }
        
        return isValid;
    }

    @Override
    public void resetPassword(String email, String otpCode, String newPassword) {
        // Verify OTP from verified cache
        String verifiedKey = OTP_VERIFIED_PREFIX + email;
        String verifiedOtp = redisTemplate.opsForValue().get(verifiedKey);
        
        if (verifiedOtp == null || !verifiedOtp.equals(otpCode)) {
            throw new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn");
        }
        
        // Find user
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Delete OTP from Redis (mark as used)
        redisTemplate.delete(OTP_PREFIX + email);
        redisTemplate.delete(verifiedKey);
        
        log.info("Password reset successfully for email: {}", email);
    }

    private String generateOTP() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }

    @Override
    public void cleanupExpiredTokens() {
        // Redis automatically handles expiration with TTL
        // This method is kept for interface compatibility but does nothing
        log.debug("Cleanup called - Redis handles expiration automatically");
    }
}
