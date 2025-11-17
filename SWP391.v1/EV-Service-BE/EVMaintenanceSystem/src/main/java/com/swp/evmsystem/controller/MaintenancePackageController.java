package com.swp.evmsystem.controller;

import com.swp.evmsystem.entity.MaintenancePackageEntity;
import com.swp.evmsystem.service.MaintenancePackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-packages")
public class MaintenancePackageController {
    
    @Autowired
    private MaintenancePackageService maintenancePackageService;
    
    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<MaintenancePackageEntity>> getAllPackages() {
        List<MaintenancePackageEntity> packages = maintenancePackageService.getAllPackages();
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }
    
    @GetMapping("/by-offer-type/{offerTypeId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<MaintenancePackageEntity>> getPackagesByOfferType(@PathVariable Integer offerTypeId) {
        List<MaintenancePackageEntity> packages = maintenancePackageService.getPackagesByOfferType(offerTypeId);
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }
}
