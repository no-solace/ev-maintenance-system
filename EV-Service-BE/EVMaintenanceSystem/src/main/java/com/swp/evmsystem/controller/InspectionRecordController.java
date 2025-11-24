package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.request.BatchUpdateInspectionRequest;
import com.swp.evmsystem.dto.response.InspectionRecordResponse;
import com.swp.evmsystem.entity.InspectionRecordEntity;
import com.swp.evmsystem.service.InspectionRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspection-records")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class InspectionRecordController {

    private final InspectionRecordService inspectionRecordService;

    @GetMapping("/reception/{receptionId}")
    public ResponseEntity<List<InspectionRecordEntity>> getRecordsByReception(
            @PathVariable Integer receptionId
    ) {
        log.info("📋 Getting inspection records for reception #{}", receptionId);
        List<InspectionRecordEntity> records = inspectionRecordService.getRecordsByReceptionId(receptionId);
        return ResponseEntity.ok(records);
    }

    /**
     * Get detailed inspection information for a reception
     * Includes reception info, package info, and all records
     */
    @GetMapping("/reception/{receptionId}/details")
    public ResponseEntity<InspectionRecordResponse.ReceptionInspectionResponse> getInspectionDetails(
            @PathVariable Integer receptionId
    ) {
        InspectionRecordResponse.ReceptionInspectionResponse response = 
            inspectionRecordService.getInspectionDetailsForReception(receptionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update status of a specific inspection record
     * Used by technician to mark task as completed with action type
     */
    @PutMapping("/{recordId}/status")
    public ResponseEntity<InspectionRecordEntity> updateRecordStatus(
            @PathVariable Integer recordId,
            @RequestParam String status
    ) {;
        InspectionRecordEntity updated = inspectionRecordService.updateRecordStatus(recordId, status);
        return ResponseEntity.ok(updated);
    }

    /**
     * Manually create inspection records for a reception
     * Used for old receptions that don't have records yet
     */
    @PostMapping("/reception/{receptionId}/create")
    public ResponseEntity<String> createRecordsForReception(
            @PathVariable Integer receptionId
    ) {
        log.info("🔧 Manually creating inspection records for reception #{}", receptionId);
        try {
            inspectionRecordService.createRecordsForExistingReception(receptionId);
            return ResponseEntity.ok("Inspection records created successfully");
        } catch (Exception e) {
            log.error("❌ Error creating records: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Batch update multiple inspection records at once
     * Used by technician to submit all checklist changes in one request
     */
    @PutMapping("/batch-update")
    public ResponseEntity<String> batchUpdateRecords(
            @RequestBody BatchUpdateInspectionRequest request
    ) {
        log.info("📦 Batch updating {} inspection records", request.getUpdates().size());
        try {
            int updatedCount = inspectionRecordService.batchUpdateRecordStatus(request.getUpdates());
            return ResponseEntity.ok(String.format("Successfully updated %d records", updatedCount));
        } catch (Exception e) {
            log.error("❌ Error batch updating records: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
