package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReceptionResponseDTO {
    Integer receptionId;
    Integer bookingId;  // Link to booking (null for walk-ins)
    String customerName;
    String customerPhone;
    String customerEmail;
    String customerAddress;
    String vehicleModel;
    String licensePlate;
    Integer mileage;
    List<String> services;
    Integer packageId;  // ID của gói bảo dưỡng được chọn
    String packageName;  // Tên gói bảo dưỡng
    Integer packagePrice;  // Giá gói bảo dưỡng
    List<SparePartInfo> spareParts;  // Danh sách phụ tùng đã chọn
    List<InspectionRecordInfo> inspectionRecords;  // Danh sách hạng mục kiểm tra
    String technicianName;
    Integer technicianId;
    String notes;
    Double totalCost;
    String status;
    LocalDateTime createdAt;
    LocalDateTime completedAt;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SparePartInfo {
        Integer sparePartId;
        String sparePartName;
        Integer quantity;
        Double unitPrice;
        LocalDateTime requestedAt;  // Thời điểm yêu cầu phụ tùng
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class InspectionRecordInfo {
        Integer recordId;
        String taskCategory;
        String taskDescription;
        String actualStatus;
        LocalDateTime checkedAt;
    }
}
