package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.request.LoginRequestDTO;
import com.swp.evmsystem.dto.response.LoginResponseDTO;
import com.swp.evmsystem.dto.response.MessageResponseDTO;
import com.swp.evmsystem.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Người dùng đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Người dùng đăng xuất
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponseDTO> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        MessageResponseDTO response = authService.logout(authHeader);
        return ResponseEntity.ok(response);
    }
}
