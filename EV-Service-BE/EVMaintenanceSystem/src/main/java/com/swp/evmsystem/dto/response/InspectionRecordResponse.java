package com.swp.evmsystem.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionRecordResponse {
    private Integer recordId;
    private Integer receptionId;
    private TaskInfo task;
    private String actualStatus;
    private LocalDateTime checkedAt;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TaskInfo {
        private Integer taskId;
        private String category;
        private String categoryDisplayName;
        private String description;
        private String kmInterval;
    }
    
    // Response for grouped records by reception
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReceptionInspectionResponse {
        private Integer receptionId;
        private String customerName;
        private String vehicleModel;
        private String licensePlate;
        private String packageName;
        private String status;
        private List<InspectionRecordResponse> records;
        private Integer totalTasks;
        private Integer completedTasks;
    }
}
