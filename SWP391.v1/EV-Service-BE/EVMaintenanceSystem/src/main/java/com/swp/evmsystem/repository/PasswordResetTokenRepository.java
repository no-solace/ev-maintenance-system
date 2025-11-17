package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Integer> {

    Optional<PasswordResetTokenEntity> findByEmailAndOtpCodeAndIsUsedFalse(String email, String otpCode);

    Optional<PasswordResetTokenEntity> findTopByEmailAndIsUsedFalseOrderByCreatedAtDesc(String email);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
