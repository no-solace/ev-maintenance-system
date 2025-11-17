package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.request.SparePartRequestDTO;
import com.swp.evmsystem.dto.response.SparePartResponseDTO;
import com.swp.evmsystem.dto.response.SparePartStatsDTO;
import com.swp.evmsystem.entity.SparePartEntity;
import com.swp.evmsystem.repository.SparePartRepository;
import com.swp.evmsystem.service.SparePartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SparePartServiceImpl implements SparePartService {
    
    @Autowired
    private SparePartRepository sparePartRepository;
    
    public List<SparePartEntity> getAllSpareParts() {
        return sparePartRepository.findAll();
    }
    
    public List<SparePartEntity> getInStockParts() {
        return sparePartRepository.findByInStock(true);
    }
    
    public SparePartEntity getSparePartById(Integer id) {
        return sparePartRepository.findById(id).orElse(null);
    }
    
    public SparePartEntity createSparePart(SparePartEntity sparePart) {
        return sparePartRepository.save(sparePart);
    }
    
    public SparePartEntity updateSparePart(SparePartEntity sparePart) {
        return sparePartRepository.save(sparePart);
    }
    
    public void deleteSparePart(Integer id) {
        sparePartRepository.deleteById(id);
    }
    
    // DTO-based methods
    public List<SparePartResponseDTO> getAllSparePartsDTO() {
        return sparePartRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public SparePartResponseDTO createSparePartDTO(SparePartRequestDTO request) {
        SparePartEntity entity = SparePartEntity.builder()
                .sparePartName(request.getPartName())
                .partNumber(request.getPartNumber())
                .category(request.getCategory())
                .price(request.getUnitPrice().intValue())
                .unitCost(request.getUnitPrice().intValue())
                .quantity(request.getStockQuantity())
                .minimumStock(request.getMinStockLevel() != null ? request.getMinStockLevel() : 10)
                .supplier(request.getSupplier())
                .description(request.getDescription())
                .inStock(request.getStockQuantity() > 0)
                .build();
        
        SparePartEntity saved = sparePartRepository.save(entity);
        return convertToDTO(saved);
    }
    
    public SparePartResponseDTO updateSparePartDTO(Integer id, SparePartRequestDTO request) {
        SparePartEntity existing = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));
        
        existing.setSparePartName(request.getPartName());
        existing.setPartNumber(request.getPartNumber());
        existing.setCategory(request.getCategory());
        existing.setPrice(request.getUnitPrice().intValue());
        existing.setUnitCost(request.getUnitPrice().intValue());
        existing.setQuantity(request.getStockQuantity());
        existing.setMinimumStock(request.getMinStockLevel() != null ? request.getMinStockLevel() : 10);
        existing.setSupplier(request.getSupplier());
        existing.setDescription(request.getDescription());
        existing.setInStock(request.getStockQuantity() > 0);
        
        SparePartEntity updated = sparePartRepository.save(existing);
        return convertToDTO(updated);
    }
    
    public void deleteSparePartById(Integer id) {
        if (!sparePartRepository.existsById(id)) {
            throw new RuntimeException("Spare part not found with id: " + id);
        }
        sparePartRepository.deleteById(id);
    }
    
    public SparePartStatsDTO getStatistics() {
        List<SparePartEntity> allParts = sparePartRepository.findAll();
        
        long total = allParts.size();
        long inStock = allParts.stream()
                .filter(p -> p.getQuantity() > p.getMinimumStock())
                .count();
        long lowStock = allParts.stream()
                .filter(p -> p.getQuantity() > 0 && p.getQuantity() <= p.getMinimumStock())
                .count();
        long outOfStock = allParts.stream()
                .filter(p -> p.getQuantity() == 0)
                .count();
        
        double totalValue = allParts.stream()
                .mapToDouble(p -> (p.getPrice() != null ? p.getPrice() : 0) * (p.getQuantity() != null ? p.getQuantity() : 0))
                .sum();
        
        return SparePartStatsDTO.builder()
                .totalParts(total)
                .inStockCount(inStock)
                .lowStockCount(lowStock)
                .outOfStockCount(outOfStock)
                .totalInventoryValue(totalValue)
                .build();
    }
    
    private SparePartResponseDTO convertToDTO(SparePartEntity entity) {
        int minStock = entity.getMinimumStock() != null ? entity.getMinimumStock() : 10;
        String status = entity.getQuantity() <= minStock ? "low" : "in-stock";
        
        return SparePartResponseDTO.builder()
                .partId(entity.getSparePartId())
                .partName(entity.getSparePartName())
                .partNumber(entity.getPartNumber())
                .category(entity.getCategory() != null ? entity.getCategory().name() : null)
                .unitPrice(entity.getPrice() != null ? entity.getPrice().doubleValue() : 0.0)
                .stockQuantity(entity.getQuantity())
                .minStockLevel(minStock)
                .supplier(entity.getSupplier())
                .description(entity.getDescription())
                .inStock(entity.getInStock())
                .status(status)
                .build();
    }
}
