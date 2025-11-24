package com.swp.evmsystem.controller;

import com.swp.evmsystem.constants.AuthMessages;
import com.swp.evmsystem.dto.request.ForgotPasswordRequestDTO;
import com.swp.evmsystem.dto.request.ResetPasswordRequestDTO;
import com.swp.evmsystem.dto.request.VerifyOTPRequest;
import com.swp.evmsystem.dto.response.MessageResponseDTO;
import com.swp.evmsystem.service.PasswordResetService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password")
public class PasswordController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot")
    public ResponseEntity<MessageResponseDTO> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) throws MessagingException {
        passwordResetService.sendOTPToEmail(request.getEmail());
        return successResponse(AuthMessages.OTP_SENT_SUCCESS);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<MessageResponseDTO> verifyOTP(
            @Valid @RequestBody VerifyOTPRequest request) {
        boolean isValid = passwordResetService.verifyOTP(request.getEmail(), request.getOtpCode());
        return isValid
                ? successResponse(AuthMessages.OTP_VALID)
                : errorResponse(HttpStatus.BAD_REQUEST, AuthMessages.OTP_INVALID);
    }

    @PostMapping("/reset")
    public ResponseEntity<MessageResponseDTO> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {
        passwordResetService.resetPassword(
                request.getEmail(),
                request.getOtpCode(),
                request.getNewPassword());
        return successResponse(AuthMessages.PASSWORD_RESET_SUCCESS);
    }

    private ResponseEntity<MessageResponseDTO> successResponse(String message) {
        return ResponseEntity.ok(MessageResponseDTO.builder()
                .success(true)
                .message(message)
                .build());
    }

    private ResponseEntity<MessageResponseDTO> errorResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status)
                .body(MessageResponseDTO.builder()
                        .success(false)
                        .message(message)
                        .build());
    }
}
