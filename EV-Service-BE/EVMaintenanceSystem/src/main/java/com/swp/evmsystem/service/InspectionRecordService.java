package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.BatchUpdateInspectionRequest;
import com.swp.evmsystem.dto.response.InspectionRecordResponse;
import com.swp.evmsystem.entity.InspectionRecordEntity;
import com.swp.evmsystem.entity.VehicleReceptionEntity;

import java.util.List;

public interface InspectionRecordService {
    
    /**
     * Tự động tạo các InspectionRecord từ MaintenancePackage của VehicleReception
     */
    void createRecordsFromPackage(VehicleReceptionEntity vehicleReception);
    
    /**
     * Lấy danh sách InspectionRecord theo receptionId
     */
    List<InspectionRecordEntity> getRecordsByReceptionId(Integer receptionId);
    
    /**
     * Lấy inspection records với thông tin đầy đủ cho reception
     */
    InspectionRecordResponse.ReceptionInspectionResponse getInspectionDetailsForReception(Integer receptionId);
    
    /**
     * Cập nhật status của một record
     */
    InspectionRecordEntity updateRecordStatus(Integer recordId, String status);
    
    /**
     * Tạo records cho reception đã tồn tại (dùng cho reception cũ)
     */
    void createRecordsForExistingReception(Integer receptionId);
    
    /**
     * Batch update multiple inspection records at once
     */
    int batchUpdateRecordStatus(List<BatchUpdateInspectionRequest.RecordUpdate> updates);
}
