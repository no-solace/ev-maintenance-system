package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.VehicleReceptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technician")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TECHNICIAN')")
public class TechnicianController {

    private final VehicleReceptionService receptionService;

    @GetMapping("/my-receptions")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getMyReceptions(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        Integer technicianId = userDetails.getId();
        List<VehicleReceptionResponseDTO> receptions = receptionService.getReceptionsByTechnician(technicianId, userDetails.getCenterId());
        return ResponseEntity.ok(receptions);
    }

    @GetMapping("/receptions/{id}")
    public ResponseEntity<VehicleReceptionResponseDTO> getReceptionById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        VehicleReceptionResponseDTO reception = receptionService.getReceptionById(id, userDetails.getCenterId());
        
        // Additional validation: ensure the reception is assigned to current technician
        if (reception.getTechnicianId() == null || !reception.getTechnicianId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
        
        return ResponseEntity.ok(reception);
    }
}
