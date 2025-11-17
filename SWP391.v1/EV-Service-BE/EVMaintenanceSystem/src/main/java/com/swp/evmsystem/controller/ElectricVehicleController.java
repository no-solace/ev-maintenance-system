package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.dto.response.VehicleHistoryDTO;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.ElectricVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ElectricVehicleController {
    @Autowired
    private ElectricVehicleService electricVehicleService;

    @GetMapping("/me/vehicles")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ElectricVehicleDTO>> getMyVehicles(@AuthenticationPrincipal UserEntityDetails userDetails) {
        List<ElectricVehicleDTO> vehicles = electricVehicleService.findByCustomerId(userDetails.getId());
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/vehicles/search")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<ApiResponse<VehicleHistoryDTO>> searchVehicle(
            @RequestParam(required = false) String licensePlate,
            @RequestParam(required = false) String vin
    ) {
        ApiResponse<VehicleHistoryDTO> response = electricVehicleService.searchVehicle(licensePlate, vin);
        
        // Return appropriate HTTP status based on response
        if (!response.isSuccess() && !response.isNotFound()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }
}
