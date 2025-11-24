package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.request.SparePartRequestDTO;
import com.swp.evmsystem.dto.response.SparePartResponseDTO;
import com.swp.evmsystem.dto.response.SparePartStatsDTO;
import com.swp.evmsystem.entity.SparePartEntity;
import com.swp.evmsystem.enums.OfferType;
import com.swp.evmsystem.enums.SparePartStatus;
import com.swp.evmsystem.exception.BusinessException;
import com.swp.evmsystem.exception.ResourceNotFoundException;
import com.swp.evmsystem.repository.CenterRepository;
import com.swp.evmsystem.repository.SparePartRepository;
import com.swp.evmsystem.service.SparePartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository sparePartRepository;
    private final CenterRepository centerRepository;

    /**
     * Get spare part entities (Entity)
     */
    @Override
    public List<SparePartEntity> getSparePartEntities() {
        return sparePartRepository.findAll().stream()
                .filter(this::isActivePart)
                .collect(Collectors.toList());
    }

    /**
     * Get in-stock spare parts (Entity)
     */
    @Override
    public List<SparePartEntity> getInStockPartEntities() {
        return sparePartRepository.findByInStock(true).stream()
                .filter(this::isActivePart)
                .collect(Collectors.toList());
    }

    /**
     * Get spare part entity by ID (Entity)
     */
    @Override
    public SparePartEntity getSparePartEntityById(Integer id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with ID: " + id));
    }

    /**
     * Create spare part (Entity)
     */
    @Override
    public SparePartEntity createSparePartEntity(SparePartEntity sparePart) {
        return saveSparePartEntity(sparePart);
    }

    /**
     * Update spare part (Entity)
     */
    @Override
    public SparePartEntity updateSparePartEntity(SparePartEntity sparePart) {
        return saveSparePartEntity(sparePart);
    }

    /**
     * Get spare parts (DTO) - filtered by center
     * @param centerId null for admin (get all), specific ID for staff/technician
     */
    @Override
    public List<SparePartResponseDTO> getSpareParts(Integer centerId) {
        return sparePartRepository.findAll().stream()
                .filter(this::isActivePart)
                .filter(part -> centerId == null || (part.getCenter() != null && java.util.Objects.equals(part.getCenter().getId(), centerId)))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get spare part by ID (DTO) - check center access
     * @param centerId null for admin (no check), specific ID for staff/technician
     */
    @Override
    public SparePartResponseDTO getSparePartById(Integer id, Integer centerId) {
        SparePartEntity entity = getSparePartEntityById(id);
        validateCenterAccess(entity, centerId);
        return convertToDTO(entity);
    }

    /**
     * Create new spare part (DTO)
     * @param request spare part data
     * @param userCenterId center ID from logged-in user (null for admin)
     */
    @Override
    public SparePartResponseDTO createSparePart(SparePartRequestDTO request, Integer userCenterId) {
        SparePartEntity entity = buildSparePartEntity(request, userCenterId);
        SparePartEntity saved = saveSparePartEntity(entity);
        return convertToDTO(saved);
    }

    /**
     * Update spare part stock (DTO) - check center access
     * @param centerId null for admin (no check), specific ID for staff/technician
     */
    @Override
    public SparePartResponseDTO updateSparePart(Integer id, SparePartRequestDTO request, Integer centerId) {
        SparePartEntity existing = getSparePartEntityById(id);
        validateCenterAccess(existing, centerId);
        updateStockQuantity(existing, request);
        SparePartEntity updated = saveSparePartEntity(existing);
        return convertToDTO(updated);
    }

    /**
     * Soft delete spare part (DTO) - check center access
     * @param centerId null for admin (no check), specific ID for staff
     */
    @Override
    public void deleteSparePart(Integer id, Integer centerId) {
        SparePartEntity entity = getSparePartEntityById(id);
        validateCenterAccess(entity, centerId);
        markAsDisabled(entity);
        saveSparePartEntity(entity);
    }

    /**
     * Get spare parts statistics - filtered by center
     * @param centerId null for admin (all parts), specific ID for staff/technician
     */
    @Override
    public SparePartStatsDTO getStatistics(Integer centerId) {
        List<SparePartEntity> allParts = sparePartRepository.findAll();
        
        // Filter by center if specified
        if (centerId != null) {
            allParts = allParts.stream()
                    .filter(part -> part.getCenter() != null && java.util.Objects.equals(part.getCenter().getId(), centerId))
                    .collect(Collectors.toList());
        }
        
        List<SparePartEntity> activeParts = allParts.stream()
                .filter(this::isActivePart)
                .collect(Collectors.toList());

        return buildStatistics(activeParts, allParts);
    }

    /**
     * Validate center access
     * @param sparePart the spare part to check
     * @param centerId null for admin (no check), specific ID for staff/technician
     */
    private void validateCenterAccess(SparePartEntity sparePart, Integer centerId) {
        // Admin has access to all (centerId == null)
        if (centerId == null) {
            return;
        }
        
        // Check if spare part belongs to the specified center
        if (sparePart.getCenter() == null || !java.util.Objects.equals(sparePart.getCenter().getId(), centerId)) {
            throw new BusinessException("You don't have access to this spare part");
        }
    }

    /**
     * Save spare part entity
     */
    private SparePartEntity saveSparePartEntity(SparePartEntity sparePart) {
        return sparePartRepository.save(sparePart);
    }

    /**
     * Check if spare part is active
     */
    private boolean isActivePart(SparePartEntity part) {
        SparePartStatus status = part.getStatus();
        return status == null || status == SparePartStatus.ACTIVE;
    }

    /**
     * Build spare part entity from request
     * @param request spare part data
     * @param userCenterId center ID from logged-in user (null for admin)
     */
    private SparePartEntity buildSparePartEntity(SparePartRequestDTO request, Integer userCenterId) {
        // Determine which center to assign
        Integer targetCenterId = determineCenterId(request.getCenterId(), userCenterId);
        
        // Fetch center entity if centerId is provided
        com.swp.evmsystem.entity.ServiceCenterEntity center = null;
        if (targetCenterId != null) {
            center = centerRepository.findById(targetCenterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Service center not found with ID: " + targetCenterId));
        }
        
        return SparePartEntity.builder()
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
                .status(SparePartStatus.ACTIVE)
                .offerType(OfferType.REPLACEMENT)
                .center(center)
                .build();
    }
    
    /**
     * Determine which center ID to use
     * @param requestCenterId center ID from request (from UI)
     * @param userCenterId center ID from logged-in user
     * @return the center ID to use (null for admin creating global spare part)
     */
    private Integer determineCenterId(Integer requestCenterId, Integer userCenterId) {
        // If user is staff (has centerId), always use their center
        if (userCenterId != null) {
            return userCenterId;
        }
        
        // If user is admin (no centerId), use the centerId from request
        // This allows admin to choose which center or leave null for all centers
        return requestCenterId;
    }

    /**
     * Update spare part information
     */
    private void updateStockQuantity(SparePartEntity sparePart, SparePartRequestDTO request) {
        // Update basic information
        sparePart.setSparePartName(request.getPartName());
        sparePart.setPartNumber(request.getPartNumber());
        sparePart.setCategory(request.getCategory());
        
        // Update pricing
        sparePart.setPrice(request.getUnitPrice().intValue());
        sparePart.setUnitCost(request.getUnitPrice().intValue());
        
        // Update stock information
        sparePart.setQuantity(request.getStockQuantity());
        sparePart.setMinimumStock(request.getMinStockLevel() != null ? request.getMinStockLevel() : 10);
        sparePart.setInStock(request.getStockQuantity() > 0);
        
        // Update supplier and description
        sparePart.setSupplier(request.getSupplier());
        sparePart.setDescription(request.getDescription());
    }

    /**
     * Mark spare part as disabled
     */
    private void markAsDisabled(SparePartEntity sparePart) {
        sparePart.setStatus(SparePartStatus.DISABLED);
        sparePart.setInStock(false);
        sparePart.setQuantity(0);
    }

    /**
     * Build statistics from spare parts
     */
    private SparePartStatsDTO buildStatistics(List<SparePartEntity> activeParts, List<SparePartEntity> allParts) {
        long total = activeParts.size();
        long inStock = activeParts.stream()
                .filter(p -> p.getQuantity() > p.getMinimumStock())
                .count();
        long lowStock = activeParts.stream()
                .filter(p -> p.getQuantity() > 0 && p.getQuantity() <= p.getMinimumStock())
                .count();
        long outOfStock = activeParts.stream()
                .filter(p -> p.getQuantity() == 0)
                .count();

        double totalValue = allParts.stream()
                .mapToDouble(p -> (p.getPrice() != null ? p.getPrice() : 0) * 
                                 (p.getQuantity() != null ? p.getQuantity() : 0))
                .sum();

        return SparePartStatsDTO.builder()
                .totalParts(total)
                .inStockCount(inStock)
                .lowStockCount(lowStock)
                .outOfStockCount(outOfStock)
                .totalInventoryValue(totalValue)
                .build();
    }

    /**
     * Convert sparePart to DTO
     */
    private SparePartResponseDTO convertToDTO(SparePartEntity sparePart) {
        int minStock = sparePart.getMinimumStock() != null ? sparePart.getMinimumStock() : 10;
        String stockStatus = sparePart.getQuantity() <= minStock ? "low" : "in-stock";

        return SparePartResponseDTO.builder()
                .partId(sparePart.getSparePartId())
                .partName(sparePart.getSparePartName())
                .partNumber(sparePart.getPartNumber())
                .category(sparePart.getCategory() != null ? sparePart.getCategory().name() : null)
                .unitPrice(sparePart.getPrice() != null ? sparePart.getPrice().doubleValue() : 0.0)
                .stockQuantity(sparePart.getQuantity())
                .minStockLevel(minStock)
                .supplier(sparePart.getSupplier())
                .description(sparePart.getDescription())
                .inStock(sparePart.getInStock())
                .status(stockStatus)
                .partStatus(sparePart.getStatus() != null ? sparePart.getStatus().name() : SparePartStatus.ACTIVE.name())
                .build();
    }
}
