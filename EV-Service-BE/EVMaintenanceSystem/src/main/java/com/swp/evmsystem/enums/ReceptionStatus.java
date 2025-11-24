package com.swp.evmsystem.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReceptionStatus {
    RECEIVED ("RECEIVED"),
    ASSIGNED ("ASSIGNED"),
    IN_PROGRESS ("IN_PROGRESS"),
    COMPLETED ("COMPLETED"),
    PAID ("PAID");

    private final String status;
}
