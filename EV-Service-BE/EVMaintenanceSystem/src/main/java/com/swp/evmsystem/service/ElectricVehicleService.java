package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;

import java.util.List;

public interface ElectricVehicleService {

    List<ElectricVehicleDTO> getVehiclesByCustomerId(Integer customerId);
    
    ApiResponse<ElectricVehicleDTO> searchVehicle(String licensePlate, String vin);
}
