package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingStatsDTO {
    Long totalBookings;
    Long pendingPaymentCount;       // Waiting for deposit payment
    Long upcomingCount;             // Confirmed appointments
    Long cancellationRequestedCount; // Cancellation requested, awaiting approval
    Long receivedCount;             // Vehicle received, being serviced
    Long completedCount;            // Completed
    Long cancelledCount;            // Cancelled
}
