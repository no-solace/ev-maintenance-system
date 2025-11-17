package com.swp.evmsystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Builder
@Data
public class TimeSlotResponseDTO {
    private LocalDate date;
    private ServiceCenterDTO center;
    private List<TimeSlotDTO> slots;
}
