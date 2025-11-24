package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.SparePartRequestDTO;
import com.swp.evmsystem.dto.response.SparePartResponseDTO;
import com.swp.evmsystem.dto.response.SparePartStatsDTO;
import com.swp.evmsystem.entity.SparePartEntity;

import java.util.List;

public interface SparePartService {
    // Entity methods
    List<SparePartEntity> getSparePartEntities();
    
    List<SparePartEntity> getInStockPartEntities();
    
    SparePartEntity getSparePartEntityById(Integer id);
    
    SparePartEntity createSparePartEntity(SparePartEntity sparePart);
    
    SparePartEntity updateSparePartEntity(SparePartEntity sparePart);
    
    // DTO methods (for controllers)
    // centerId = null means get all (for admin)
    List<SparePartResponseDTO> getSpareParts(Integer centerId);
    
    SparePartResponseDTO getSparePartById(Integer id, Integer centerId);
    
    SparePartResponseDTO createSparePart(SparePartRequestDTO request, Integer userCenterId);
    
    SparePartResponseDTO updateSparePart(Integer id, SparePartRequestDTO request, Integer centerId);
    
    void deleteSparePart(Integer id, Integer centerId);
    
    SparePartStatsDTO getStatistics(Integer centerId);
}
