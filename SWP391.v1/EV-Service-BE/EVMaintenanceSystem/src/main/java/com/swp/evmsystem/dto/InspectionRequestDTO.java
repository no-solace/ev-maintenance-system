package com.swp.evmsystem.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionRequestDTO {
    private Integer bookingId;
    private String generalNotes;
    private String batteryHealth;
    private String motorCondition;
    private String brakeCondition;
    private String tireCondition;
    private String electricalSystem;
    private Double estimatedCost;
    private Integer estimatedTimeHours;
    private List<InspectionItemDTO> items;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InspectionItemDTO {
        private Integer sparePartId;
        private Integer quantity;
        private Double unitPrice;
        private String issueDescription;
        private Boolean isCritical;
    }
}
