package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TimeSlotWithBookingsDTO {
    LocalTime slotTime; // e.g., 14:00, 15:00, 16:00
    Boolean isCurrentSlot; // true for current slot, false for future slots
    Integer bookingCount; // Total number of bookings in this slot
    List<BookingResponseDTO> bookings; // List of all bookings in this time slot
}
