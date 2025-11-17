package com.swp.evmsystem.enums;

public enum InspectionStatus {
    PENDING,           // Waiting for customer approval
    APPROVED,          // Customer approved, ready to proceed
    REJECTED,          // Customer rejected
    IN_PROGRESS,       // Technician is working
    COMPLETED          // Work completed
}
