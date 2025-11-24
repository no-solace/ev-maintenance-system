package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.LoginRequestDTO;
import com.swp.evmsystem.dto.response.LoginResponseDTO;
import com.swp.evmsystem.dto.response.MessageResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO loginRequest);

    MessageResponseDTO logout(String authHeader);
}
