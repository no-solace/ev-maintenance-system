package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.constants.AuthMessages;
import com.swp.evmsystem.dto.request.LoginRequestDTO;
import com.swp.evmsystem.dto.response.LoginResponseDTO;
import com.swp.evmsystem.dto.response.MessageResponseDTO;
import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.security.JwtService;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.AuthService;
import com.swp.evmsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtTokenProvider;
    private final UserService userService;

    /**
     * Authenticate user and generate JWT token
     */
    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        UserEntityDetails userDetails = authenticateUser(loginRequest);
        String token = jwtTokenProvider.generateToken(userDetails);
        UserDTO userDto = userService.getUserByUserDetail(userDetails);

        return new LoginResponseDTO(token, userDto);
    }

    /**
     * Logout user by blacklisting their token
     */
    @Override
    public MessageResponseDTO logout(String authHeader) {
        String token = extractToken(authHeader);
        jwtTokenProvider.blacklistToken(token);

        return new MessageResponseDTO(AuthMessages.LOGOUT_SUCCESS, true);
    }

    /**
     * Authenticate user credentials using Spring Security
     */
    private UserEntityDetails authenticateUser(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        return (UserEntityDetails) authentication.getPrincipal();
    }

    /**
     * Extract JWT token from Authorization header
     */
    private String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token");
        }
        return authHeader.substring(7);
    }
}
