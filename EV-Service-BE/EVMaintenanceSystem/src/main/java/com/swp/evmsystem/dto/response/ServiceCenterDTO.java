package com.swp.evmsystem.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Setter
@Getter
@Builder
public class ServiceCenterDTO {
    private int id;
    private String centerName;
    private String centerAddress;
    private String centerPhone;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
    private Integer maxCapacity;
    // Geographic coordinates
    private Double latitude;
    private Double longitude;
}
