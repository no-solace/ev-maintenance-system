package com.swp.evmsystem.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
public class TimeSlotDTO {
    Integer centerId;
    LocalDate date;
    @JsonFormat(pattern = "HH:mm")
    LocalTime time;
    Integer numOfBookings;
    Integer maxCapacity;
    Boolean available;
}