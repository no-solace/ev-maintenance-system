package com.swp.evmsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "password_reset_token")
public class PasswordResetTokenEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    Integer id;
    
    @Column(name = "email", nullable = false, length = 100)
    String email;
    
    @Column(name = "otp_code", nullable = false, length = 6)
    String otpCode;
    
    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;
    
    @Column(name = "expires_at", nullable = false)
    LocalDateTime expiresAt;
    
    @Column(name = "is_used", nullable = false)
    Boolean isUsed;
    
    @Column(name = "used_at")
    LocalDateTime usedAt;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
