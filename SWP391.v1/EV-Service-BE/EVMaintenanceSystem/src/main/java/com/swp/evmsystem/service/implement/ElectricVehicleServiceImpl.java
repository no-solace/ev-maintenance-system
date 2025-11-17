package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.dto.response.VehicleHistoryDTO;
import com.swp.evmsystem.entity.CustomerEntity;
import com.swp.evmsystem.entity.ElectricVehicleEntity;
import com.swp.evmsystem.entity.VehicleReceptionEntity;
import com.swp.evmsystem.enums.EvMaintenanceStatus;
import com.swp.evmsystem.mapper.ElectricVehicleMapper;
import com.swp.evmsystem.repository.ElectricVehicleRepository;
import com.swp.evmsystem.repository.UserRepository;
import com.swp.evmsystem.repository.VehicleReceptionRepository;
import com.swp.evmsystem.service.ElectricVehicleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ElectricVehicleServiceImpl implements ElectricVehicleService {
    @Autowired
    ElectricVehicleRepository electricVehicleRepository;
    @Autowired
    ElectricVehicleMapper mapper;
    @Autowired
    UserRepository userRepository;
    @Autowired
    VehicleReceptionRepository receptionRepository;

    @Override
    public List<ElectricVehicleDTO> findByCustomerId(Integer customerId) {
        CustomerEntity customer = (CustomerEntity) userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return electricVehicleRepository.findByOwner(customer)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean create(ElectricVehicleEntity ev) {
        return electricVehicleRepository.save(ev) != null;
    }

    @Override
    public boolean isEvAvailableForBooking(Integer evId) {
        return electricVehicleRepository.findById(evId).get().getMaintenanceStatus() == EvMaintenanceStatus.AVAILABLE;
    }
    
    @Override
    public ApiResponse<VehicleHistoryDTO> searchVehicle(String licensePlate, String vin) {
        log.info("Searching vehicle - License: '{}', VIN: '{}'", licensePlate, vin);
        
        // Validation: at least one parameter must be provided
        if ((licensePlate == null || licensePlate.trim().isEmpty()) && 
            (vin == null || vin.trim().isEmpty())) {
            log.warn("Validation failed: No search parameters provided");
            return ApiResponse.error("Vui lòng cung cấp biển số hoặc VIN");
        }
        
        // Step 1: Find vehicle in xe_dien table
        ElectricVehicleEntity vehicle = null;
        
        if (vin != null && !vin.trim().isEmpty()) {
            log.debug("Searching vehicle by VIN: {}", vin.trim());
            vehicle = electricVehicleRepository.findByVin(vin.trim()).orElse(null);
        }
        
        if (vehicle == null && licensePlate != null && !licensePlate.trim().isEmpty()) {
            log.debug("Searching vehicle by license plate: {}", licensePlate.trim());
            vehicle = electricVehicleRepository.findByLicensePlate(licensePlate.trim()).orElse(null);
        }
        
        if (vehicle == null) {
            log.info("Vehicle not found in database");
            return ApiResponse.notFound("Không tìm thấy xe trong hệ thống");
        }
        
        log.info("Found vehicle: {} (VIN: {})", vehicle.getLicensePlate(), vehicle.getVin());
        
        // Step 2: Find reception history for this vehicle
        List<VehicleReceptionEntity> receptions = receptionRepository.findByLicensePlateIgnoreCase(vehicle.getLicensePlate());
        log.debug("Found {} reception(s) for this vehicle", receptions.size());
        
        // Get customer info from vehicle owner
        CustomerEntity owner = vehicle.getOwner();
        
        // Get customer address safely
        String customerAddress = null;
        if (owner.getAddress() != null) {
            try {
                customerAddress = owner.getAddress().toString();
                log.debug("Customer address retrieved: {}", customerAddress);
            } catch (Exception e) {
                log.warn("Error getting customer address: {}", e.getMessage());
            }
        } else {
            log.debug("Customer address is null in database");
        }
        
        // Build history DTO
        VehicleHistoryDTO.VehicleHistoryDTOBuilder historyBuilder = 
            VehicleHistoryDTO.builder()
                .vehicleModel(vehicle.getModel() != null ? vehicle.getModel().getModelName() : "")
                .licensePlate(vehicle.getLicensePlate())
                .vin(vehicle.getVin())
                .customerName(owner.getFullName())
                .customerPhone(owner.getPhone())
                .customerEmail(owner.getEmail())
                .customerAddress(customerAddress)
                .totalVisits(receptions.size())
                .isReturningCustomer(receptions.size() > 0);
        
        // Add last reception info if exists
        if (!receptions.isEmpty()) {
            VehicleReceptionEntity lastReception = receptions.get(0);
            
            historyBuilder
                    .lastMileage(lastReception.getMileage())
                    .lastReceptionId(lastReception.getReceptionId())
                    .lastVisitDate(lastReception.getCreatedAt())
                    .lastServices(lastReception.getServices());
        }
        
        VehicleHistoryDTO history = historyBuilder.build();
        log.info("Successfully built vehicle history for customer: {}", history.getCustomerName());
        
        return ApiResponse.success("Tìm thấy thông tin xe", history);
    }
}
