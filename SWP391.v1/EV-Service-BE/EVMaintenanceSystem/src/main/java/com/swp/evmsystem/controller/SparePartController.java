package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.request.SparePartRequestDTO;
import com.swp.evmsystem.dto.response.SparePartResponseDTO;
import com.swp.evmsystem.dto.response.SparePartStatsDTO;
import com.swp.evmsystem.entity.SparePartEntity;
import com.swp.evmsystem.service.SparePartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spare-parts")
public class SparePartController {
    
    @Autowired
    private SparePartService sparePartService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'TECHNICIAN', 'CUSTOMER')")
    public ResponseEntity<List<SparePartResponseDTO>> getAllSpareParts() {
        List<SparePartResponseDTO> spareParts = sparePartService.getAllSparePartsDTO();
        return ResponseEntity.ok(spareParts);
    }
    
    @GetMapping("/in-stock")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getInStockParts() {
        try {
            List<SparePartEntity> spareParts = sparePartService.getInStockParts();
            System.out.println("✅ Found " + spareParts.size() + " spare parts in stock");
            
            // Convert to simple DTO to avoid serialization issues
            List<SparePartResponseDTO> response = spareParts.stream()
                    .map(part -> SparePartResponseDTO.builder()
                            .partId(part.getSparePartId())
                            .partName(part.getSparePartName())
                            .partNumber(part.getPartNumber())
                            .category(part.getCategory() != null ? part.getCategory().name() : null)
                            .unitPrice(part.getPrice() != null ? part.getPrice().doubleValue() : 0.0)
                            .stockQuantity(part.getQuantity())
                            .minStockLevel(part.getMinimumStock() != null ? part.getMinimumStock() : 10)
                            .supplier(part.getSupplier())
                            .description(part.getDescription())
                            .inStock(part.getInStock())
                            .build())
                    .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting in-stock parts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error loading spare parts: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<SparePartEntity> getSparePartById(@PathVariable Integer id) {
        SparePartEntity sparePart = sparePartService.getSparePartById(id);
        if (sparePart == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(sparePart, HttpStatus.OK);
    }
    
    // Statistics endpoint
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<SparePartStatsDTO> getStatistics() {
        SparePartStatsDTO stats = sparePartService.getStatistics();
        return ResponseEntity.ok(stats);
    }
    
    // Admin endpoints
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> createSparePart(@Valid @RequestBody SparePartRequestDTO request) {
        SparePartResponseDTO created = sparePartService.createSparePartDTO(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> updateSparePart(@PathVariable Integer id, @Valid @RequestBody SparePartRequestDTO request) {
        SparePartResponseDTO updated = sparePartService.updateSparePartDTO(id, request);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> deleteSparePart(@PathVariable Integer id) {
        sparePartService.deleteSparePartById(id);
        return ResponseEntity.noContent().build();
    }
}
