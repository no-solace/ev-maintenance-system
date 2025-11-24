package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TimeSlotBookingDTO {
    LocalTime slotTime; // e.g., 14:00, 15:00, 16:00
    Integer bookingCount; // Number of bookings in this time slot
    Boolean isCurrentSlot; // true for current slot, false for future slots
}
