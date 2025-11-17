package com.swp.evmsystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        log.info("========== JWT Filter - Incoming Request ==========");
        log.info("Request Method: {}", request.getMethod());
        log.info("Request URI: {}", request.getRequestURI());
        
        final String authHeader = request.getHeader("Authorization");
        log.info("Authorization Header: {}", authHeader != null ? authHeader : "NULL");
        
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("No valid Authorization header found. Skipping JWT authentication.");
            log.info("===================================================");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        log.info("Received JWT token: {}", jwt);
        
        try {
            userEmail = jwtService.extractUsername(jwt);
            log.info("Extracted username from JWT: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.info("Loading user details for: {}", userEmail);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    log.info("JWT token is valid. Authenticating user: {}", userEmail);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Authentication successful for user: {}", userEmail);
                } else {
                    log.warn("JWT token validation failed for user: {}", userEmail);
                }
            } else if (userEmail == null) {
                log.warn("Could not extract username from JWT token");
            } else {
                log.info("User already authenticated in SecurityContext");
            }
        } catch (Exception ex) {
            log.error("Failed to process JWT token: {}", ex.getMessage(), ex);
        }
        
        log.info("===================================================\n");
        filterChain.doFilter(request, response);
    }

}
