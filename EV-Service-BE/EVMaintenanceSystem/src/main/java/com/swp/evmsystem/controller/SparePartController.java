package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.request.SparePartRequestDTO;
import com.swp.evmsystem.dto.response.SparePartResponseDTO;
import com.swp.evmsystem.dto.response.SparePartStatsDTO;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.SparePartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spare-parts")
@RequiredArgsConstructor
public class SparePartController {

    private final SparePartService sparePartService;

    /**
     * Get spare parts (filtered by center for staff/technician)
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<SparePartResponseDTO>> getSpareParts(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<SparePartResponseDTO> spareParts = sparePartService.getSpareParts(userDetails.getCenterId());
        return ResponseEntity.ok(spareParts);
    }

    /**
     * Get in-stock spare parts (filtered by center for staff/technician)
     * MUST be before /{id} to avoid path conflict
     */
    @GetMapping("/in-stock")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<SparePartResponseDTO>> getInStockParts(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<SparePartResponseDTO> spareParts = sparePartService.getSpareParts(userDetails.getCenterId());
        // Filter only in-stock parts
        List<SparePartResponseDTO> inStockParts = spareParts.stream()
                .filter(part -> part.getInStock() != null && part.getInStock())
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(inStockParts);
    }

    /**
     * Get spare parts statistics (filtered by center for staff)
     * MUST be before /{id} to avoid path conflict
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<SparePartStatsDTO> getStatistics(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        SparePartStatsDTO stats = sparePartService.getStatistics(userDetails.getCenterId());
        return ResponseEntity.ok(stats);
    }

    /**
     * Get spare part by ID (check center access for staff/technician)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> getSparePartById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        SparePartResponseDTO sparePart = sparePartService.getSparePartById(id, userDetails.getCenterId());
        return ResponseEntity.ok(sparePart);
    }

    /**
     * Create new spare part
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> createSparePart(
            @Valid @RequestBody SparePartRequestDTO request,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        SparePartResponseDTO created = sparePartService.createSparePart(request, userDetails.getCenterId());
        return ResponseEntity.created(null).body(created);
    }

    /**
     * Update spare part (check center access for staff)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> updateSparePart(
            @PathVariable Integer id,
            @Valid @RequestBody SparePartRequestDTO request,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        SparePartResponseDTO updated = sparePartService.updateSparePart(id, request, userDetails.getCenterId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete spare part (check center access for staff)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> deleteSparePart(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        sparePartService.deleteSparePart(id, userDetails.getCenterId());
        return ResponseEntity.ok("Spare part deleted successfully");
    }
}
