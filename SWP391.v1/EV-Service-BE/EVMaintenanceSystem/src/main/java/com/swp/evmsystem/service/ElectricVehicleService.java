package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.dto.response.VehicleHistoryDTO;
import com.swp.evmsystem.entity.ElectricVehicleEntity;

import java.util.List;

public interface ElectricVehicleService {
    List<ElectricVehicleDTO> findByCustomerId(Integer customerId);

    boolean create(ElectricVehicleEntity ev);

    boolean isEvAvailableForBooking(Integer evId);
    
    ApiResponse<VehicleHistoryDTO> searchVehicle(String licensePlate, String vin);
}
