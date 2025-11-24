package com.swp.evmsystem.dto.response;

import com.swp.evmsystem.enums.OfferType;
import com.swp.evmsystem.enums.PackageLevel;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PackageWithTasksResponse {
    private Integer packageId;
    private OfferType offerType;
    private PackageLevel level;
    private String packageName;
    private Integer price;
    private Integer durationMinutes;
    private String description;
    private List<InspectionTaskInfo> inspectionTasks;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InspectionTaskInfo {
        private Integer taskId;
        private String category;
        private String description;
        private String kmInterval;
        private Integer displayOrder;
        private Boolean isMandatory;
    }
}
