package com.swp.evmsystem.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ErrorResponse {
    private final String title;
    private final int status;
    private final String message;
    private final LocalDateTime timestamp;
}
