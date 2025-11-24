package com.swp.evmsystem.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildError(HttpStatus.BAD_REQUEST, errors));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                buildError(HttpStatus.NOT_FOUND, ex.getMessage())
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                buildError(HttpStatus.FORBIDDEN, ex.getMessage())
        );
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                buildError(HttpStatus.BAD_REQUEST, ex.getMessage())
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleGeneral(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                buildError(HttpStatus.UNAUTHORIZED, ex.getMessage())
        );
    }

    private Map<String, Object> buildError(HttpStatus status, Object message) {
        Map<String, Object> body = new HashMap<>();
        body.put("title", status.getReasonPhrase());
        body.put("status", status.value());
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now());

        return body;
    }

    @ExceptionHandler(HttpClientErrorException.Forbidden.class)
    public ResponseEntity<?> handle403(HttpClientErrorException.Forbidden ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(buildError(HttpStatus.FORBIDDEN, ex.getMessage()));
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(buildError(HttpStatus.NOT_FOUND, ex.getMessage()));
    }
    
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(buildError(HttpStatus.BAD_REQUEST, ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, 
                        "An unexpected error occurred: " + ex.getMessage()));
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .title(status.getReasonPhrase())
                .message(message)
                .build();

        return ResponseEntity.status(status).body(error);
    }
}
