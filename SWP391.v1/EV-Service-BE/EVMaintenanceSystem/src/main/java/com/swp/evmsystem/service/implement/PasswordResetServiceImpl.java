package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.PasswordResetTokenEntity;
import com.swp.evmsystem.entity.UserEntity;
import com.swp.evmsystem.repository.PasswordResetTokenRepository;
import com.swp.evmsystem.repository.UserRepository;
import com.swp.evmsystem.service.EmailService;
import com.swp.evmsystem.service.PasswordResetService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {
    
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${otp.expiration.minutes:5}")
    private int otpExpirationMinutes;
    
    @Value("${otp.length:6}")
    private int otpLength;
//guiotp
    @Transactional
    public void sendOTPToEmail(String email) throws MessagingException {
        // Kiểm tra email có tồn tại trong hệ thống không
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));
        
        // random otp
        String otpCode = generateOTP();
        
        // Lưu OTP vào database
        PasswordResetTokenEntity token = PasswordResetTokenEntity.builder()
                .email(email)
                .otpCode(otpCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpirationMinutes))
                .isUsed(false)
                .build();
        
        tokenRepository.save(token);
        
        // Gửi email chứa OTP
        emailService.sendOTPEmail(email, otpCode);
    }
    
//xac thuc otp
    @Transactional(readOnly = true)
    public boolean verifyOTP(String email, String otpCode) {
        // tim toekn
        PasswordResetTokenEntity token = tokenRepository
                .findByEmailAndOtpCodeAndIsUsedFalse(email, otpCode)
                .orElse(null);
        
        if (token == null) {
            return false;
        }
        
        // Kiểm tra xem OTP đã hết hạn chưa
        if (token.isExpired()) {
            return false;
        }
        
        return true;
    }
    
//dat lai mk
    @Transactional
    public void resetPassword(String email, String otpCode, String newPassword) {
        // Xác thực OTP
        PasswordResetTokenEntity token = tokenRepository
                .findByEmailAndOtpCodeAndIsUsedFalse(email, otpCode)
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ hoặc đã được sử dụng"));
        
        // Kiểm tra OTP có hết hạn không
        if (token.isExpired()) {
            throw new RuntimeException("Mã OTP đã hết hạn");
        }
        
        // Tìm user theo email
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        // Cập nhật mật khẩu mới (đã mã hóa)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Đánh dấu token đã được sử dụng
        token.setIsUsed(true);
        token.setUsedAt(LocalDateTime.now());
        tokenRepository.save(token);
    }
//random otp
    private String generateOTP() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }
    
//xat thuc otp
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
