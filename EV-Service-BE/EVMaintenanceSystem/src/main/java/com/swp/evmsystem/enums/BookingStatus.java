package com.swp.evmsystem.enums;

public enum BookingStatus {
    PENDING_PAYMENT,        // Waiting for deposit payment
    UPCOMING,               // Deposit paid, appointment confirmed
    UPDATE_REQUESTED,       // Customer requested to update booking info (awaiting staff approval)
    CANCELLATION_REQUESTED, // Customer requested cancellation (awaiting staff approval)
    RECEIVED,               // Customer arrived, vehicle received
    COMPLETED,              // Appointment completed
    CANCELLED,               // Appointment cancelled
    VISITED                  // Customer visited without prior booking
}
