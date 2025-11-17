package com.swp.evmsystem.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionResponseDTO {
    private Integer inspectionId;
    private Integer bookingId;
    private String technicianName;
    private String status;
    private String generalNotes;
    private String batteryHealth;
    private String motorCondition;
    private String brakeCondition;
    private String tireCondition;
    private String electricalSystem;
    private Double estimatedCost;
    private Integer estimatedTimeHours;
    private LocalDateTime inspectionDate;
    private List<InspectionItemResponseDTO> items;
    
    // Booking info
    private String vehicleModel;
    private String licensePlate;
    private String customerName;
    private String customerPhone;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InspectionItemResponseDTO {
        private Integer itemId;
        private Integer sparePartId;
        private String sparePartName;
        private Integer quantity;
        private Double unitPrice;
        private Double totalPrice;
        private String issueDescription;
        private Boolean isCritical;
    }
}
