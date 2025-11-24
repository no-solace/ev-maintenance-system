package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CenterBookingSlotsDTO {
    Integer centerId;
    String centerName;
    LocalDate date; // Today's date
    
    // List of time slots with their bookings (current + next 2 slots)
    List<TimeSlotWithBookingsDTO> slots;
    
    // Total bookings today
    Integer totalTodayBookings;
}
