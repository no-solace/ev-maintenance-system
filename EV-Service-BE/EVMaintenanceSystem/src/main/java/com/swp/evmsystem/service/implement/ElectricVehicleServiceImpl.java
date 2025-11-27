package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.dto.response.OwnerDTO;
import com.swp.evmsystem.model.CustomerEntity;
import com.swp.evmsystem.model.VehicleEntity;
import com.swp.evmsystem.mapper.ElectricVehicleMapper;
import com.swp.evmsystem.repository.VehicleRepository;
import com.swp.evmsystem.service.ElectricVehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElectricVehicleServiceImpl implements ElectricVehicleService {

    final VehicleRepository vehicleRepository;
    final ElectricVehicleMapper mapper;

    @Override
    public List<ElectricVehicleDTO> getVehiclesByCustomerId(Integer customerId) {
        return vehicleRepository.findByOwnerId(customerId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public ApiResponse<ElectricVehicleDTO> searchVehicle(String licensePlate, String vin) {
        log.info("Searching vehicle - License: '{}', VIN: '{}'", licensePlate, vin);
        
        // Validation: at least one parameter must be provided
        if ((licensePlate == null || licensePlate.trim().isEmpty()) && 
            (vin == null || vin.trim().isEmpty())) {
            log.warn("Validation failed: No search parameters provided");
            return ApiResponse.error("Vui lòng cung cấp biển số hoặc VIN");
        }
        
        // Find vehicle by VIN or license plate
        VehicleEntity vehicle = null;
        
        if (vin != null && !vin.trim().isEmpty()) {
            log.debug("Searching vehicle by VIN: {}", vin.trim());
            vehicle = vehicleRepository.findByVin(vin.trim()).orElse(null);
        }
        
        if (vehicle == null && licensePlate != null && !licensePlate.trim().isEmpty()) {
            log.debug("Searching vehicle by license plate: {}", licensePlate.trim());
            vehicle = vehicleRepository.findByLicensePlate(licensePlate.trim()).orElse(null);
        }
        
        if (vehicle == null) {
            log.info("Vehicle not found in database");
            return ApiResponse.notFound("Không tìm thấy xe trong hệ thống");
        }
        
        // Convert to DTO with manual owner mapping
        ElectricVehicleDTO vehicleDTO = mapper.toDTO(vehicle);
        
        // Manually map owner information
        CustomerEntity owner = vehicle.getOwner();
        if (owner != null) {
            OwnerDTO ownerDTO = OwnerDTO.builder()
                    .id(owner.getId())
                    .name(owner.getFullName())
                    .phone(owner.getPhone())
                    .email(owner.getEmail())
                    .address(owner.getAddress() != null ? owner.getAddress().toString() : null)
                    .build();
            vehicleDTO.setOwner(ownerDTO);
        }
        
        log.info("Successfully found vehicle: {}", vehicle.getLicensePlate());
        
        return ApiResponse.success("Tìm thấy thông tin xe", vehicleDTO);
    }
}
