package com.swp.evmsystem.controller;

import com.swp.evmsystem.constants.AuthMessages;
import com.swp.evmsystem.dto.request.ForgotPasswordRequestDTO;
import com.swp.evmsystem.dto.request.LoginRequestDTO;
import com.swp.evmsystem.dto.request.ResetPasswordRequestDTO;
import com.swp.evmsystem.dto.request.VerifyOTPRequestDTO;
import com.swp.evmsystem.dto.response.LoginResponseDTO;
import com.swp.evmsystem.dto.response.MessageResponseDTO;
import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.security.JwtService;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.PasswordResetService;
import com.swp.evmsystem.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtTokenProvider;
    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        UserEntityDetails userDetails = (UserEntityDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails);
        UserDTO userDto = userService.getUserByUserDetail(userDetails);
        LoginResponseDTO loginResponseDTO = new LoginResponseDTO(token, userDto);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<MessageResponseDTO> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) throws MessagingException {
        passwordResetService.sendOTPToEmail(request.getEmail());
        return successResponse(AuthMessages.OTP_SENT_SUCCESS);
    }

    @PostMapping("/password/verify-otp")
    public ResponseEntity<MessageResponseDTO> verifyOTP(
            @Valid @RequestBody VerifyOTPRequestDTO request) {
        boolean isValid = passwordResetService.verifyOTP(request.getEmail(), request.getOtpCode());
        return isValid 
            ? successResponse(AuthMessages.OTP_VALID)
            : errorResponse(HttpStatus.BAD_REQUEST, AuthMessages.OTP_INVALID);
    }

    @PostMapping("/password/reset")
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
