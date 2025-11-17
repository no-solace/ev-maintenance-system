package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.VehicleReceptionRequestDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;

import java.util.List;

public interface VehicleReceptionService {
    VehicleReceptionResponseDTO createReception(VehicleReceptionRequestDTO request);
    
    VehicleReceptionResponseDTO getReceptionById(Integer receptionId);
    
    List<VehicleReceptionResponseDTO> getAllReceptions();
    
    List<VehicleReceptionResponseDTO> getReceptionsByStatus(String status);
    
    List<VehicleReceptionResponseDTO> getReceptionsByTechnician(Integer technicianId);
    
    VehicleReceptionResponseDTO updateReceptionStatus(Integer receptionId, String status);
    
    VehicleReceptionResponseDTO addSpareParts(Integer receptionId, List<Integer> sparePartIds);
    
    VehicleReceptionResponseDTO assignTechnician(Integer receptionId, Integer technicianId);
}
