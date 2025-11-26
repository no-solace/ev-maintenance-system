package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.VehicleReceptionRequest;
import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.model.SparePartEntity;

import java.util.List;

public interface VehicleReceptionService {

    VehicleReceptionResponseDTO createReception(VehicleReceptionRequest request, Integer centerId);
    
    VehicleReceptionResponseDTO getReceptionById(Integer receptionId, Integer centerId);
    
    List<VehicleReceptionResponseDTO> getReceptions(Integer centerId);
    
    List<VehicleReceptionResponseDTO> getReceptionsByStatus(String status, Integer centerId);
    
    List<VehicleReceptionResponseDTO> getReceptionsByTechnician(Integer technicianId, Integer centerId);
    
    VehicleReceptionResponseDTO updateReceptionStatus(Integer receptionId, String status, Integer centerId, Integer userId, String userRole);
    
    VehicleReceptionResponseDTO addSpareParts(Integer receptionId, List<Integer> sparePartIds, Integer centerId);
    
    VehicleReceptionResponseDTO assignTechnician(Integer receptionId, Integer technicianId, Integer centerId);
    
    List<SparePartEntity> getSpareParts(Integer receptionId, Integer centerId);
    
    List<OfferTypeDTO> getAllOfferTypes();
    
    /**
     * Get walk-in receptions (no booking) for a specific center
     * Returns receptions in FIFO order (ordered by createdAt ASC)
     * Only includes receptions with status RECEIVED or IN_PROGRESS
     */
    List<VehicleReceptionResponseDTO> getWalkinReceptionsByCenter(Integer centerId);
    
    /**
     * Get all receptions for a specific customer
     * Returns receptions ordered by createdAt DESC
     */
    List<VehicleReceptionResponseDTO> getReceptionsByCustomerId(Integer customerId);
}
