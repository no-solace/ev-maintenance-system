package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.dto.response.EvModelDTO;
import com.swp.evmsystem.enums.VehicleModel;
import com.swp.evmsystem.service.ElectricVehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class VehicleController {
    @Autowired
    private ElectricVehicleService electricVehicleService;

    @GetMapping("/vehicles/search")
    @PreAuthorize("hasAnyRole('STAFF', 'MANAGER')")
    public ResponseEntity<ApiResponse<ElectricVehicleDTO>> searchVehicle(
            @RequestParam(required = false) String licensePlate,
            @RequestParam(required = false) String vin) {
        ApiResponse<ElectricVehicleDTO> response = electricVehicleService.searchVehicle(licensePlate, vin);

        // Return appropriate HTTP status based on response
        if (!response.isSuccess() && !response.isNotFound()) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/vehicles/models")
    public ResponseEntity<List<EvModelDTO>> getAllModels() {
        List<EvModelDTO> models = Arrays.stream(VehicleModel.values())
                .map(model -> EvModelDTO.builder()
                        .modelId(model.ordinal() + 1)
                        .modelName(model.getName())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(models);
    }
}
