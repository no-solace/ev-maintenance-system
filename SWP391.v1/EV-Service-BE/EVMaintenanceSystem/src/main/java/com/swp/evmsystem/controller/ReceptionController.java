package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.request.VehicleReceptionRequest;
import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.entity.MaintenancePackageEntity;
import com.swp.evmsystem.entity.SparePartEntity;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.MaintenancePackageService;
import com.swp.evmsystem.service.VehicleReceptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receptions")
@RequiredArgsConstructor
public class ReceptionController {

    final private VehicleReceptionService receptionService;
    final private MaintenancePackageService maintenancePackageService;

    /**
     * Create new vehicle reception
     */
    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> createReception(
            @Valid @RequestBody VehicleReceptionRequest request,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        VehicleReceptionResponseDTO response = receptionService.createReception(request, userDetails.getCenterId());
        return ResponseEntity.created(null).body(response);
    }

    /**
     * Get receptions (filtered by center for staff/technician)
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getReceptions(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<VehicleReceptionResponseDTO> receptions = receptionService.getReceptions(userDetails.getCenterId());
        return ResponseEntity.ok(receptions);
    }

    /**
     * Get reception by ID (check center access)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> getReceptionById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        VehicleReceptionResponseDTO response = receptionService.getReceptionById(id, userDetails.getCenterId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get receptions by status (filtered by center)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getReceptionsByStatus(
            @PathVariable String status,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<VehicleReceptionResponseDTO> receptions = receptionService.getReceptionsByStatus(status, userDetails.getCenterId());
        return ResponseEntity.ok(receptions);
    }

    /**
     * Get receptions by technician (for staff/admin to view any technician's work)
     */
    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getReceptionsByTechnicianId(
            @PathVariable Integer technicianId,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<VehicleReceptionResponseDTO> receptions = receptionService.getReceptionsByTechnician(technicianId, userDetails.getCenterId());
        return ResponseEntity.ok(receptions);
    }

    /**
     * Update reception status
     * Only TECHNICIAN can set status to IN_PROGRESS or COMPLETED
     * STAFF/ADMIN can only update to RECEIVED or ASSIGNED
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> updateReceptionStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        VehicleReceptionResponseDTO response = receptionService.updateReceptionStatus(
            id, request.get("status"), userDetails.getCenterId(), userDetails.getId(), userDetails.getRole().name());
        return ResponseEntity.ok(response);
    }

    /**
     * Add spare parts to reception (check center access)
     */
    @PatchMapping("/{id}/add-parts")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> addSpareParts(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        @SuppressWarnings("unchecked")
        List<Integer> sparePartIds = (List<Integer>) request.get("sparePartIds");
        VehicleReceptionResponseDTO response = receptionService.addSpareParts(id, sparePartIds, userDetails.getCenterId());
        return ResponseEntity.ok(response);
    }

    /**
     * Assign technician to reception (check center access)
     */
    @PatchMapping("/{id}/assign-technician")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> assignTechnician(
            @PathVariable Integer id,
            @RequestParam Integer technicianId,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        VehicleReceptionResponseDTO response = receptionService.assignTechnician(id, technicianId, userDetails.getCenterId());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get spare parts for reception (check center access)
     */
    @GetMapping("/{id}/spare-parts")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> getSpareParts(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<SparePartEntity> spareParts = receptionService.getSpareParts(id, userDetails.getCenterId());
        return ResponseEntity.ok(spareParts);
    }

    /**
     * Get all offer types
     */
    @GetMapping("/offer-types")
    public ResponseEntity<List<OfferTypeDTO>> getAllOfferTypes() {
        List<OfferTypeDTO> offerTypes = receptionService.getAllOfferTypes();
        return ResponseEntity.ok(offerTypes);
    }

    @GetMapping("/maintenance-packages")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<MaintenancePackageEntity>> getAllPackages() {
        List<MaintenancePackageEntity> packages = maintenancePackageService.getPackages();
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }
    
    /**
     * Get walk-in receptions (no booking) for authenticated staff's center
     * Returns receptions in FIFO order (First In First Out)
     * Only shows receptions with status RECEIVED or IN_PROGRESS
     */
    @GetMapping("/walkin-queue")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getWalkinQueue(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        Integer centerId = userDetails.getCenterId();
        if (centerId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        List<VehicleReceptionResponseDTO> walkinQueue = receptionService.getWalkinReceptionsByCenter(centerId);
        return ResponseEntity.ok(walkinQueue);
    }
}
