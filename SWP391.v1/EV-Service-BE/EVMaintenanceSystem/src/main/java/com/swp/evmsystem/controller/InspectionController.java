package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.InspectionRequestDTO;
import com.swp.evmsystem.dto.InspectionResponseDTO;
import com.swp.evmsystem.service.InspectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inspections")
@CrossOrigin(origins = "*")
public class InspectionController {
    
    @Autowired
    private InspectionService inspectionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> createInspection(@RequestBody InspectionRequestDTO request) {
        InspectionResponseDTO response = inspectionService.createInspection(request, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> getInspectionByBookingId(@PathVariable Integer bookingId) {
        InspectionResponseDTO response = inspectionService.getInspectionByBookingId(bookingId);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No inspection found for booking: " + bookingId);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{inspectionId}/approve")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> approveInspection(@PathVariable Integer inspectionId) {
        inspectionService.approveInspection(inspectionId);
        return ResponseEntity.ok("Inspection approved successfully");
    }

    @PostMapping("/{inspectionId}/reject")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> rejectInspection(@PathVariable Integer inspectionId) {
        inspectionService.rejectInspection(inspectionId);
        return ResponseEntity.ok("Inspection rejected successfully");
    }

    @PostMapping("/{inspectionId}/complete")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> completeInspection(@PathVariable Integer inspectionId) {
        inspectionService.completeInspection(inspectionId);
        return ResponseEntity.ok("Work completed successfully");
    }

    @PostMapping("/reception")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> createInspectionForReception(@RequestBody InspectionRequestDTO request) {
        InspectionResponseDTO response = inspectionService.createInspectionForReception(request, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reception/{receptionId}")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'STAFF', 'ADMIN')")
    public ResponseEntity<?> getInspectionByReceptionId(@PathVariable Integer receptionId) {
        InspectionResponseDTO response = inspectionService.getInspectionByReceptionId(receptionId);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No inspection found for reception: " + receptionId);
        }
        return ResponseEntity.ok(response);
    }
}
