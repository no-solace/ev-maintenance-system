package com.swp.evmsystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VehicleHistoryDTO {
    // Vehicle info
    private String vehicleModel;
    private String licensePlate;
    private String vin;
    private Integer lastMileage;
    
    // Customer info
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerAddress;
    
    // Last reception info
    private Integer lastReceptionId;
    private LocalDateTime lastVisitDate;
    private String lastServices;
    
    // Statistics
    private Integer totalVisits;
    private boolean isReturningCustomer;
}
