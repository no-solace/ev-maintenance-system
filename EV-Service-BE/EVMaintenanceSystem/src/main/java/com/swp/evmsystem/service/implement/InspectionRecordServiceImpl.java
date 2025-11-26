package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.InspectionRecordResponse;
import com.swp.evmsystem.model.InspectionRecordEntity;
import com.swp.evmsystem.model.InspectionTaskEntity;
import com.swp.evmsystem.model.MaintenancePackageEntity;
import com.swp.evmsystem.model.VehicleReceptionEntity;
import com.swp.evmsystem.enums.InspectionStatus;
import com.swp.evmsystem.enums.KmInterval;
import com.swp.evmsystem.enums.PackageLevel;
import com.swp.evmsystem.repository.InspectionRecordRepository;
import com.swp.evmsystem.repository.InspectionTaskRepository;
import com.swp.evmsystem.repository.VehicleReceptionRepository;
import com.swp.evmsystem.service.InspectionRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionRecordServiceImpl implements InspectionRecordService {

    private final InspectionRecordRepository inspectionRecordRepository;
    private final InspectionTaskRepository inspectionTaskRepository;
    private final VehicleReceptionRepository vehicleReceptionRepository;

    @Override
    @Transactional
    public void createRecordsFromPackage(VehicleReceptionEntity vehicleReception) {
        if (vehicleReception.getMaintenancePackage() == null) {
            log.info("No maintenance package selected for reception #{}", vehicleReception.getReceptionId());
            return;
        }

        MaintenancePackageEntity maintenancePackage = vehicleReception.getMaintenancePackage();
        List<InspectionTaskEntity> tasks = getTasksForPackageLevel(maintenancePackage.getLevel());

        if (tasks.isEmpty()) {
            log.warn("No tasks found for package level {}", maintenancePackage.getLevel());
            return;
        }

        for (InspectionTaskEntity task : tasks) {
            InspectionRecordEntity record = InspectionRecordEntity.builder()
                    .inspectionTask(task)
                    .vehicleReception(vehicleReception)
                    .actionType(InspectionStatus.PENDING)
                    .build();

            inspectionRecordRepository.save(record);
        }
    }

    private List<InspectionTaskEntity> getTasksForPackageLevel(PackageLevel level) {
        List<KmInterval> intervals = new ArrayList<>();

        intervals.add(KmInterval.ONE_THOUSAND);
        if (level.getValue() >= 5000) {
            intervals.add(KmInterval.FIVE_THOUSAND);
        }
        if (level.getValue() >= 10000) {
            intervals.add(KmInterval.TEN_THOUSAND);
        }

        return inspectionTaskRepository.findByKmIntervalIn(intervals);
    }

    @Override
    public List<InspectionRecordEntity> getRecordsByReceptionId(Integer receptionId) {
        return inspectionRecordRepository.findByVehicleReception_ReceptionIdOrderByInspectionTask_Id(receptionId);
    }

    @Override
    @Transactional
    public InspectionRecordEntity updateRecordStatus(Integer recordId, String status) {
        InspectionRecordEntity record = inspectionRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Inspection record not found"));

        InspectionStatus actionType =
                InspectionStatus.valueOf(status.toUpperCase());
        record.setActionType(actionType);

        // Set checked time when action is performed (not PENDING)
        if (actionType != InspectionStatus.PENDING) {
            record.setCheckedAt(java.time.LocalDateTime.now());
        }

        return inspectionRecordRepository.save(record);
    }


    @Override
    @Transactional
    public void createRecordsForExistingReception(Integer receptionId) {
        VehicleReceptionEntity reception = vehicleReceptionRepository.findById(receptionId)
                .orElseThrow(() -> new RuntimeException("Reception not found with id: " + receptionId));
        
        // Check if records already exist
        List<InspectionRecordEntity> existingRecords = inspectionRecordRepository
                .findByVehicleReception_ReceptionId(receptionId);
        
        if (!existingRecords.isEmpty()) {
            log.warn("Reception #{} already has {} inspection records", receptionId, existingRecords.size());
            throw new RuntimeException("Reception already has inspection records");
        }
        
        // Create records from package
        createRecordsFromPackage(reception);
    }

    @Override
    @Transactional(readOnly = true)
    public InspectionRecordResponse.ReceptionInspectionResponse getInspectionDetailsForReception(Integer receptionId) {
        log.info("📋 Getting inspection details for reception #{}", receptionId);
        
        List<InspectionRecordEntity> records = inspectionRecordRepository
                .findByVehicleReception_ReceptionIdOrderByInspectionTask_Id(receptionId);

        if (records.isEmpty()) {
            log.warn("❌ No inspection records found for reception #{}", receptionId);
            throw new RuntimeException("No inspection records found for reception #" + receptionId);
        }

        log.info("✅ Found {} inspection records", records.size());
        
        VehicleReceptionEntity reception = records.get(0).getVehicleReception();
        
        // Force load lazy relationships
        reception.getCustomerName();
        if (reception.getMaintenancePackage() != null) {
            reception.getMaintenancePackage().getPackageName();
        }

        // Convert records to response DTOs
        List<InspectionRecordResponse> recordResponses = records.stream()
                .map(record -> {
                    // Force load lazy relationships
                    InspectionTaskEntity task = record.getInspectionTask();
                    task.getDescription(); // Trigger lazy load
                    
                    InspectionRecordResponse response = InspectionRecordResponse.builder()
                            .recordId(record.getRecordId())
                            .receptionId(receptionId)
                            .task(InspectionRecordResponse.TaskInfo.builder()
                                    .taskId(task.getId())
                                    .category(task.getCategory().name())
                                    .categoryDisplayName(task.getCategory().getDisplayName())
                                    .description(task.getDescription())
                                    .kmInterval(task.getKmInterval().toString())
                                    .build())
                            .actualStatus(record.getActionType().name())
                            .checkedAt(record.getCheckedAt())
                            .build();
                    
                    log.debug("Mapped record #{}: {} - {}", 
                            response.getRecordId(), 
                            response.getTask().getDescription(), 
                            response.getActualStatus());
                    
                    return response;
                })
                .toList();

        // Count completed tasks (not PENDING)
        long completedCount = records.stream()
                .filter(r -> r.getActionType() != InspectionStatus.PENDING)
                .count();

        return InspectionRecordResponse.ReceptionInspectionResponse.builder()
                .receptionId(receptionId)
                .customerName(reception.getCustomerName())
                .vehicleModel(reception.getVehicleModel())
                .licensePlate(reception.getLicensePlate())
                .packageName(reception.getMaintenancePackage() != null
                        ? reception.getMaintenancePackage().getPackageName()
                        : "N/A")
                .status(reception.getStatus().name())
                .records(recordResponses)
                .totalTasks(records.size())
                .completedTasks((int) completedCount)
                .build();
    }

    @Override
    @Transactional
    public int batchUpdateRecordStatus(List<com.swp.evmsystem.dto.request.BatchUpdateInspectionRequest.RecordUpdate> updates) {
        log.info("📦 Starting batch update for {} records", updates.size());
        
        int successCount = 0;
        for (com.swp.evmsystem.dto.request.BatchUpdateInspectionRequest.RecordUpdate update : updates) {
            try {
                InspectionRecordEntity record = inspectionRecordRepository.findById(update.getRecordId())
                        .orElseThrow(() -> new RuntimeException("Record not found: " + update.getRecordId()));

                InspectionStatus actionType =
                        InspectionStatus.valueOf(update.getStatus().toUpperCase());
                record.setActionType(actionType);

                // Set checked time when action is performed (not PENDING)
                if (actionType != InspectionStatus.PENDING) {
                    record.setCheckedAt(java.time.LocalDateTime.now());
                }

                inspectionRecordRepository.save(record);
                successCount++;
                
                log.debug("✅ Updated record #{} to status {}", update.getRecordId(), update.getStatus());
            } catch (Exception e) {
                log.error("❌ Failed to update record #{}: {}", update.getRecordId(), e.getMessage());
            }
        }
        
        log.info("✅ Batch update completed: {}/{} records updated successfully", successCount, updates.size());
        return successCount;
    }
}