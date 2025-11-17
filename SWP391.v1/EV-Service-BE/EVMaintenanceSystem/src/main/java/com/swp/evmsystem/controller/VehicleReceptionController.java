package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.request.VehicleReceptionRequestDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.service.VehicleReceptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicle-reception")
@RequiredArgsConstructor
public class VehicleReceptionController {
    
    private final VehicleReceptionService receptionService;
    
    /**
     * Create a new vehicle reception record
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> createReception(@Valid @RequestBody VehicleReceptionRequestDTO request) {
        VehicleReceptionResponseDTO response = receptionService.createReception(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Get all vehicle receptions
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getAllReceptions() {
        List<VehicleReceptionResponseDTO> receptions = receptionService.getAllReceptions();
        return ResponseEntity.ok(receptions);
    }
    
    /**
     * Get vehicle reception by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> getReceptionById(@PathVariable Integer id) {
        VehicleReceptionResponseDTO response = receptionService.getReceptionById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get receptions by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getReceptionsByStatus(@PathVariable String status) {
        List<VehicleReceptionResponseDTO> receptions = receptionService.getReceptionsByStatus(status);
        return ResponseEntity.ok(receptions);
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getReceptionsByTechnician(@PathVariable Integer technicianId) {
        List<VehicleReceptionResponseDTO> receptions = receptionService.getReceptionsByTechnician(technicianId);
        return ResponseEntity.ok(receptions);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> updateReceptionStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Status is required"));
        }
        
        VehicleReceptionResponseDTO response = receptionService.updateReceptionStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/add-parts")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> addSpareParts(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Integer> sparePartIds = (List<Integer>) request.get("sparePartIds");
        if (sparePartIds == null || sparePartIds.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Spare part IDs are required"));
        }
        
        VehicleReceptionResponseDTO response = receptionService.addSpareParts(id, sparePartIds);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign-technician")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> assignTechnician(
            @PathVariable Integer id,
            @RequestParam Integer technicianId) {
        try {
            VehicleReceptionResponseDTO response = receptionService.assignTechnician(id, technicianId);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
