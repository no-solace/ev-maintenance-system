package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.request.SparePartRequestDTO;
import com.swp.evmsystem.dto.response.SparePartResponseDTO;
import com.swp.evmsystem.dto.response.SparePartStatsDTO;
import com.swp.evmsystem.entity.SparePartEntity;

import java.util.List;

public interface SparePartService {
    List<SparePartEntity> getAllSpareParts();
    
    List<SparePartEntity> getInStockParts();
    
    SparePartEntity getSparePartById(Integer id);
    
    SparePartEntity createSparePart(SparePartEntity sparePart);
    
    SparePartEntity updateSparePart(SparePartEntity sparePart);
    
    void deleteSparePart(Integer id);
    
    List<SparePartResponseDTO> getAllSparePartsDTO();
    
    SparePartResponseDTO createSparePartDTO(SparePartRequestDTO request);
    
    SparePartResponseDTO updateSparePartDTO(Integer id, SparePartRequestDTO request);
    
    void deleteSparePartById(Integer id);
    
    SparePartStatsDTO getStatistics();
}
