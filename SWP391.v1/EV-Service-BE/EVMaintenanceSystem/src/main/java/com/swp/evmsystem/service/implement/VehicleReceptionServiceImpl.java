package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.request.VehicleReceptionRequestDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.entity.BookingEntity;
import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.entity.MaintenancePackageEntity;
import com.swp.evmsystem.entity.SparePartEntity;
import com.swp.evmsystem.entity.IssueEntity;
import com.swp.evmsystem.entity.VehicleReceptionEntity;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.exception.ResourceNotFoundException;
import com.swp.evmsystem.repository.BookingRepository;
import com.swp.evmsystem.repository.EmployeeRepository;
import com.swp.evmsystem.repository.MaintenancePackageRepository;
import com.swp.evmsystem.repository.SparePartRepository;
import com.swp.evmsystem.repository.IssueRepository;
import com.swp.evmsystem.repository.VehicleReceptionRepository;
import com.swp.evmsystem.service.VehicleReceptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleReceptionServiceImpl implements VehicleReceptionService {
    
    private final VehicleReceptionRepository receptionRepository;
    private final EmployeeRepository employeeRepository;
    private final MaintenancePackageRepository maintenancePackageRepository;
    private final SparePartRepository sparePartRepository;
    private final IssueRepository issueRepository;
    private final BookingRepository bookingRepository;
    private final com.swp.evmsystem.repository.ElectricVehicleRepository electricVehicleRepository;
    
    @Override
    @Transactional
    public VehicleReceptionResponseDTO createReception(VehicleReceptionRequestDTO request) {
        // CRITICAL VALIDATION: Vehicle must exist in system (unless from booking)
        if (request.getBookingId() == null) {
            log.info("Validating vehicle existence for walk-in customer: {}", request.getLicensePlate());
            
            // For walk-in customers, verify vehicle exists in xe_dien table
            boolean vehicleExists = electricVehicleRepository
                    .findByLicensePlate(request.getLicensePlate())
                    .isPresent();
            
            if (!vehicleExists) {
                log.warn("Vehicle reception rejected - vehicle not found: {}", request.getLicensePlate());
                throw new IllegalStateException(
                    "Xe với biển số " + request.getLicensePlate() + 
                    " không có trong hệ thống. Vui lòng đăng ký xe trước khi tiếp nhận."
                );
            }
            
            log.info("Vehicle validation passed for: {}", request.getLicensePlate());
        } else {
            log.info("Skipping vehicle validation - reception from booking #{}", request.getBookingId());
        }
        
        // Validate technician exists
        EmployeeEntity technician = employeeRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + request.getTechnicianId()));
        
        // Update technician working status to ON_WORKING
        technician.setWorkingStatus(com.swp.evmsystem.enums.WorkingStatus.ON_WORKING);
        employeeRepository.save(technician);
        
        // Reduce spare part quantities for initial selection
        if (request.getSelectedSpareParts() != null && !request.getSelectedSpareParts().isEmpty()) {
            List<SparePartEntity> selectedParts = sparePartRepository.findAllById(request.getSelectedSpareParts());
            for (SparePartEntity part : selectedParts) {
                if (part.getQuantity() <= 0) {
                    throw new IllegalStateException("Spare part " + part.getSparePartName() + " is out of stock");
                }
                part.setQuantity(part.getQuantity() - 1);
                if (part.getQuantity() == 0) {
                    part.setInStock(false);
                }
                sparePartRepository.save(part);
            }
        }
        
        // Calculate total cost from selected items
        double totalCost = calculateTotalCostFromItems(
            request.getSelectedMaintenancePackages(),
            request.getSelectedSpareParts(),
            request.getSelectedIssues()
        );
        
        // Convert services list to comma-separated string
        String servicesString = request.getServices() != null && !request.getServices().isEmpty() 
            ? String.join(",", request.getServices()) 
            : "";
        
        // If bookingId is provided, link to booking and update booking status
        BookingEntity booking = null;
        if (request.getBookingId() != null) {
            booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));
            
            // Update booking status to RECEIVED
            booking.setStatus(BookingStatus.RECEIVED);
            bookingRepository.save(booking);
        }
        
        // Create entity
        VehicleReceptionEntity entity = VehicleReceptionEntity.builder()
                .booking(booking)  // Link to booking (null for walk-ins)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .customerAddress(request.getCustomerAddress())
                .vehicleModel(request.getVehicleModel())
                .licensePlate(request.getLicensePlate())
                .mileage(request.getMileage())
                .services(servicesString)
                .assignedTechnician(technician)
                .notes(request.getNotes())
                .totalCost(totalCost)
                .status("RECEIVED")
                .build();
        
        // Save to database
        VehicleReceptionEntity savedEntity = receptionRepository.save(entity);
        
        // Update vehicle maintenance status to IN_SERVICE
        var vehicleOpt = electricVehicleRepository.findByLicensePlate(request.getLicensePlate());
        if (vehicleOpt.isPresent()) {
            com.swp.evmsystem.entity.ElectricVehicleEntity vehicle = vehicleOpt.get();
            vehicle.setMaintenanceStatus(com.swp.evmsystem.enums.EvMaintenanceStatus.IN_SERVICE);
            electricVehicleRepository.save(vehicle);
            log.info("Updated vehicle {} maintenance status to IN_SERVICE", request.getLicensePlate());
        }
        
        // Convert to response DTO
        return convertToResponseDTO(savedEntity);
    }
    
    @Override
    public VehicleReceptionResponseDTO getReceptionById(Integer receptionId) {
        VehicleReceptionEntity entity = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
        return convertToResponseDTO(entity);
    }
    
    @Override
    public List<VehicleReceptionResponseDTO> getAllReceptions() {
        return receptionRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<VehicleReceptionResponseDTO> getReceptionsByStatus(String status) {
        return receptionRepository.findByStatus(status).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<VehicleReceptionResponseDTO> getReceptionsByTechnician(Integer technicianId) {
        return receptionRepository.findByAssignedTechnicianId(technicianId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public VehicleReceptionResponseDTO updateReceptionStatus(Integer receptionId, String status) {
        VehicleReceptionEntity entity = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
        
        entity.setStatus(status);
        
        // Update vehicle maintenance status
        var vehicleOpt = electricVehicleRepository.findByLicensePlate(entity.getLicensePlate());
        if (vehicleOpt.isPresent()) {
            com.swp.evmsystem.entity.ElectricVehicleEntity vehicle = vehicleOpt.get();
            
            if ("RECEIVED".equals(status)) {
                vehicle.setMaintenanceStatus(com.swp.evmsystem.enums.EvMaintenanceStatus.IN_SERVICE);
                electricVehicleRepository.save(vehicle);
                log.info("Updated vehicle {} maintenance status to IN_SERVICE", entity.getLicensePlate());
            } else if ("COMPLETED".equals(status)) {
                // When service is completed, set to COMPLETED (waiting for payment)
                // Will be set to AVAILABLE after payment is completed
                vehicle.setMaintenanceStatus(com.swp.evmsystem.enums.EvMaintenanceStatus.COMPLETED);
                electricVehicleRepository.save(vehicle);
                log.info("Updated vehicle {} maintenance status to COMPLETED (waiting for payment)", entity.getLicensePlate());
            }
        }
        
        // Update linked booking status if exists
        if (entity.getBooking() != null && "COMPLETED".equals(status)) {
            BookingEntity booking = entity.getBooking();
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
            log.info("Updated booking #{} status to COMPLETED", booking.getBookingId());
        }
        
        // Update technician working status based on reception status
        if (entity.getAssignedTechnician() != null) {
            EmployeeEntity technician = entity.getAssignedTechnician();
            
            if ("COMPLETED".equals(status) || "CANCELLED".equals(status)) {
                // Check if technician has any other active receptions
                long activeReceptions = receptionRepository.countByAssignedTechnicianAndStatusNotIn(
                    technician, 
                    Arrays.asList("COMPLETED", "CANCELLED", "REJECTED")
                );
                
                // If no other active receptions, set status to AVAILABLE
                if (activeReceptions == 0) {
                    technician.setWorkingStatus(com.swp.evmsystem.enums.WorkingStatus.AVAILABLE);
                    employeeRepository.save(technician);
                    log.info("Updated technician #{} status to AVAILABLE", technician.getId());
                }
            }
        }
        
        VehicleReceptionEntity updatedEntity = receptionRepository.save(entity);
        
        return convertToResponseDTO(updatedEntity);
    }
    
    @Override
    @Transactional
    public VehicleReceptionResponseDTO addSpareParts(Integer receptionId, List<Integer> sparePartIds) {
        VehicleReceptionEntity entity = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
        
        // Fetch spare parts and calculate additional cost
        List<SparePartEntity> spareParts = sparePartRepository.findAllById(sparePartIds);
        
        // Reduce spare part quantities
        for (SparePartEntity part : spareParts) {
            if (part.getQuantity() <= 0) {
                throw new IllegalStateException("Spare part " + part.getSparePartName() + " is out of stock");
            }
            // Decrease quantity by 1 for each selected part
            part.setQuantity(part.getQuantity() - 1);
            // Update inStock status if quantity reaches 0
            if (part.getQuantity() == 0) {
                part.setInStock(false);
            }
            sparePartRepository.save(part);
        }
        
        double additionalCost = spareParts.stream()
                .mapToDouble(SparePartEntity::getPrice)
                .sum();
        
        // Update total cost
        double currentCost = entity.getTotalCost() != null ? entity.getTotalCost() : 0.0;
        entity.setTotalCost(currentCost + additionalCost);
        
        // Update notes
        String currentNotes = entity.getNotes() != null ? entity.getNotes() : "";
        String partNames = spareParts.stream()
                .map(SparePartEntity::getSparePartName)
                .collect(Collectors.joining(", "));
        String additionalNote = String.format("\n[Thêm phụ tùng]: %s (+%.0f₫)", partNames, additionalCost);
        entity.setNotes(currentNotes + additionalNote);
        
        // Save and return
        VehicleReceptionEntity updatedEntity = receptionRepository.save(entity);
        return convertToResponseDTO(updatedEntity);
    }
    
    @Override
    @Transactional
    public VehicleReceptionResponseDTO assignTechnician(Integer receptionId, Integer technicianId) {
        // Find the reception
        VehicleReceptionEntity reception = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
        
        // Find the technician
        EmployeeEntity technician = employeeRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + technicianId));
        
        // Check if technician is OFF_DUTY
        if (technician.getWorkingStatus() == com.swp.evmsystem.enums.WorkingStatus.OFF_DUTY) {
            throw new IllegalStateException("Cannot assign technician who is off duty");
        }
        
        // If reception already has a technician, update their status
        if (reception.getAssignedTechnician() != null) {
            EmployeeEntity oldTechnician = reception.getAssignedTechnician();
            
            // Check if old technician has other active receptions
            long activeReceptions = receptionRepository.countByAssignedTechnicianAndStatusNotIn(
                oldTechnician,
                Arrays.asList("COMPLETED", "CANCELLED", "REJECTED")
            );
            
            // If no other active receptions, set old technician to AVAILABLE
            if (activeReceptions == 1) { // Only this reception
                oldTechnician.setWorkingStatus(com.swp.evmsystem.enums.WorkingStatus.AVAILABLE);
                employeeRepository.save(oldTechnician);
            }
        }
        
        // Assign new technician
        reception.setAssignedTechnician(technician);
        
        // Update new technician status to ON_WORKING
        technician.setWorkingStatus(com.swp.evmsystem.enums.WorkingStatus.ON_WORKING);
        employeeRepository.save(technician);
        
        // Save reception
        VehicleReceptionEntity updatedReception = receptionRepository.save(reception);
        
        return convertToResponseDTO(updatedReception);
    }
    
    // Helper methods
    
    private double calculateTotalCostFromItems(
            List<Integer> packageIds,
            List<Integer> sparePartIds,
            List<Integer> issueIds
    ) {
        double total = 0.0;
        
        // Add maintenance package costs (ONLY ONE PACKAGE ALLOWED)
        if (packageIds != null && !packageIds.isEmpty()) {
            // Validate: Only one maintenance package can be selected
            if (packageIds.size() > 1) {
                throw new IllegalArgumentException("Chỉ được chọn 1 gói bảo dưỡng. Hiện tại đã chọn " + packageIds.size() + " gói.");
            }
            
            List<MaintenancePackageEntity> packages = maintenancePackageRepository.findAllById(packageIds);
            total += packages.stream()
                    .mapToDouble(MaintenancePackageEntity::getPrice)
                    .sum();
        }
        
        // Add spare part costs
        if (sparePartIds != null && !sparePartIds.isEmpty()) {
            List<SparePartEntity> spareParts = sparePartRepository.findAllById(sparePartIds);
            total += spareParts.stream()
                    .mapToDouble(SparePartEntity::getPrice)
                    .sum();
        }
        
        // Note: Issues don't have a price field - they're just for tracking
        
        return total;
    }

    private VehicleReceptionResponseDTO convertToResponseDTO(VehicleReceptionEntity entity) {
        return VehicleReceptionResponseDTO.builder()
                .receptionId(entity.getReceptionId())
                .bookingId(entity.getBooking() != null ? entity.getBooking().getBookingId() : null)
                .customerName(entity.getCustomerName())
                .customerPhone(entity.getCustomerPhone())
                .customerEmail(entity.getCustomerEmail())
                .customerAddress(entity.getCustomerAddress())
                .vehicleModel(entity.getVehicleModel())
                .licensePlate(entity.getLicensePlate())
                .mileage(entity.getMileage())
                .services(Arrays.asList(entity.getServices().split(",")))
                .technicianName(entity.getAssignedTechnician().getFullName())
                .technicianId(entity.getAssignedTechnician().getId())
                .notes(entity.getNotes())
                .totalCost(entity.getTotalCost())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
