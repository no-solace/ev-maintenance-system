package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.InspectionRequestDTO;
import com.swp.evmsystem.dto.InspectionResponseDTO;
import com.swp.evmsystem.entity.*;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.enums.InspectionStatus;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.repository.VehicleReceptionRepository;
import com.swp.evmsystem.service.InspectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class InspectionServiceImpl implements InspectionService {
    
    @Autowired
    private InspectionRepository inspectionRepository;
    
    @Autowired
    private InspectionItemRepository inspectionItemRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private SparePartRepository sparePartRepository;
    
    @Autowired
    private VehicleReceptionRepository vehicleReceptionRepository;
    
    @Transactional
    public InspectionResponseDTO createInspection(InspectionRequestDTO request, Integer technicianId) {
        // Get booking
        BookingEntity booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if booking status is ASSIGNED or IN_PROGRESS
        if (booking.getStatus() != BookingStatus.RECEIVED && booking.getStatus() != BookingStatus.UPCOMING) {
            throw new RuntimeException("Booking must be ASSIGNED or IN_PROGRESS to create inspection");
        }
        
        // Create inspection
        InspectionEntity inspection = InspectionEntity.builder()
                .booking(booking)
                .inspectionDate(LocalDateTime.now())
                .status(InspectionStatus.PENDING)
                .generalNotes(request.getGeneralNotes())
                .batteryHealth(request.getBatteryHealth())
                .motorCondition(request.getMotorCondition())
                .brakeCondition(request.getBrakeCondition())
                .tireCondition(request.getTireCondition())
                .electricalSystem(request.getElectricalSystem())
                .estimatedCost(request.getEstimatedCost())
                .estimatedTimeHours(request.getEstimatedTimeHours())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        InspectionEntity savedInspection = inspectionRepository.save(inspection);
        
        // Create inspection items (spare parts needed)
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (InspectionRequestDTO.InspectionItemDTO itemDTO : request.getItems()) {
                SparePartEntity sparePart = sparePartRepository.findById(itemDTO.getSparePartId())
                        .orElseThrow(() -> new RuntimeException("Spare part not found: " + itemDTO.getSparePartId()));
                
                Double totalPrice = itemDTO.getUnitPrice() * itemDTO.getQuantity();
                
                InspectionItemEntity item = InspectionItemEntity.builder()
                        .inspection(savedInspection)
                        .sparePart(sparePart)
                        .quantity(itemDTO.getQuantity())
                        .unitPrice(itemDTO.getUnitPrice())
                        .totalPrice(totalPrice)
                        .issueDescription(itemDTO.getIssueDescription())
                        .isCritical(itemDTO.getIsCritical())
                        .build();
                
                inspectionItemRepository.save(item);
            }
        }
        
        // Update booking status to IN_PROGRESS
        booking.setStatus(BookingStatus.RECEIVED);
        bookingRepository.save(booking);
        
        return getInspectionByBookingId(request.getBookingId());
    }
    
    public InspectionResponseDTO getInspectionByBookingId(Integer bookingId) {
        InspectionEntity inspection = inspectionRepository.findByBooking_BookingId(bookingId)
                .orElse(null);
        
        if (inspection == null) {
            return null;
        }
        
        return convertToDTO(inspection);
    }
    
    private InspectionResponseDTO convertToDTO(InspectionEntity inspection) {
        BookingEntity booking = inspection.getBooking();
        ElectricVehicleEntity vehicle = booking.getVehicle();
        CustomerEntity customer = vehicle.getOwner();
        
        List<InspectionItemEntity> items = inspectionItemRepository
                .findByInspection_InspectionId(inspection.getInspectionId());
        
        List<InspectionResponseDTO.InspectionItemResponseDTO> itemDTOs = items.stream()
                .map(item -> InspectionResponseDTO.InspectionItemResponseDTO.builder()
                        .itemId(item.getItemId())
                        .sparePartId(item.getSparePart().getSparePartId())
                        .sparePartName(item.getSparePart().getSparePartName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .issueDescription(item.getIssueDescription())
                        .isCritical(item.getIsCritical())
                        .build())
                .collect(Collectors.toList());
        
        return InspectionResponseDTO.builder()
                .inspectionId(inspection.getInspectionId())
                .bookingId(booking.getBookingId())
                .technicianName(inspection.getTechnician().getFullName())
                .status(inspection.getStatus().name())
                .generalNotes(inspection.getGeneralNotes())
                .batteryHealth(inspection.getBatteryHealth())
                .motorCondition(inspection.getMotorCondition())
                .brakeCondition(inspection.getBrakeCondition())
                .tireCondition(inspection.getTireCondition())
                .electricalSystem(inspection.getElectricalSystem())
                .estimatedCost(inspection.getEstimatedCost())
                .estimatedTimeHours(inspection.getEstimatedTimeHours())
                .inspectionDate(inspection.getInspectionDate())
                .items(itemDTOs)
                .vehicleModel(vehicle.getModel().getModelName())
                .licensePlate(vehicle.getLicensePlate())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .build();
    }
    
    @Transactional
    public void approveInspection(Integer inspectionId) {
        InspectionEntity inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));
        
        if (inspection.getStatus() != InspectionStatus.PENDING) {
            throw new RuntimeException("Only PENDING inspections can be approved");
        }
        
        inspection.setStatus(InspectionStatus.APPROVED);
        inspection.setUpdatedAt(LocalDateTime.now());
        inspectionRepository.save(inspection);
        
        log.info("Inspection {} approved by customer", inspectionId);
    }
    
    @Transactional
    public void rejectInspection(Integer inspectionId) {
        InspectionEntity inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));
        
        if (inspection.getStatus() != InspectionStatus.PENDING) {
            throw new RuntimeException("Only PENDING inspections can be rejected");
        }
        
        inspection.setStatus(InspectionStatus.REJECTED);
        inspection.setUpdatedAt(LocalDateTime.now());
        inspectionRepository.save(inspection);
        
        // Update booking status back to ASSIGNED
        BookingEntity booking = inspection.getBooking();
        //booking.setStatus(BookingStatus.ASSIGNED);
        bookingRepository.save(booking);
        
        log.info("Inspection {} rejected by customer", inspectionId);
    }
    
    @Transactional
    public void completeInspection(Integer inspectionId) {
        InspectionEntity inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found"));
        
        if (inspection.getStatus() != InspectionStatus.APPROVED && inspection.getStatus() != InspectionStatus.IN_PROGRESS) {
            throw new RuntimeException("Only APPROVED or IN_PROGRESS inspections can be completed");
        }
        
        inspection.setStatus(InspectionStatus.COMPLETED);
        inspection.setUpdatedAt(LocalDateTime.now());
        inspectionRepository.save(inspection);
        
        // Update booking or reception status to COMPLETED
        if (inspection.getBooking() != null) {
            BookingEntity booking = inspection.getBooking();
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
        } else if (inspection.getReception() != null) {
            VehicleReceptionEntity reception = inspection.getReception();
            reception.setStatus("COMPLETED");
            vehicleReceptionRepository.save(reception);
        }
        
        log.info("Inspection {} completed by technician", inspectionId);
    }
    
    // ========== WALK-IN CUSTOMER (RECEPTION) METHODS ==========
    
    @Transactional
    public InspectionResponseDTO createInspectionForReception(InspectionRequestDTO request, Integer technicianId) {
        // Get reception instead of booking
        VehicleReceptionEntity reception = vehicleReceptionRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Reception not found"));
        
        // Create inspection
        InspectionEntity inspection = InspectionEntity.builder()
                .reception(reception)
                .booking(null)
                .technician(reception.getAssignedTechnician())
                .inspectionDate(LocalDateTime.now())
                .status(InspectionStatus.PENDING)
                .generalNotes(request.getGeneralNotes())
                .batteryHealth(request.getBatteryHealth())
                .motorCondition(request.getMotorCondition())
                .brakeCondition(request.getBrakeCondition())
                .tireCondition(request.getTireCondition())
                .electricalSystem(request.getElectricalSystem())
                .estimatedCost(request.getEstimatedCost())
                .estimatedTimeHours(request.getEstimatedTimeHours())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        InspectionEntity savedInspection = inspectionRepository.save(inspection);
        
        // Create inspection items (spare parts needed)
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (InspectionRequestDTO.InspectionItemDTO itemDTO : request.getItems()) {
                SparePartEntity sparePart = sparePartRepository.findById(itemDTO.getSparePartId())
                        .orElseThrow(() -> new RuntimeException("Spare part not found: " + itemDTO.getSparePartId()));
                
                Double totalPrice = itemDTO.getUnitPrice() * itemDTO.getQuantity();
                
                InspectionItemEntity item = InspectionItemEntity.builder()
                        .inspection(savedInspection)
                        .sparePart(sparePart)
                        .quantity(itemDTO.getQuantity())
                        .unitPrice(itemDTO.getUnitPrice())
                        .totalPrice(totalPrice)
                        .issueDescription(itemDTO.getIssueDescription())
                        .isCritical(itemDTO.getIsCritical())
                        .build();
                
                inspectionItemRepository.save(item);
            }
        }
        
        // Update reception status to IN_PROGRESS
        reception.setStatus("IN_PROGRESS");
        vehicleReceptionRepository.save(reception);
        
        return getInspectionByReceptionId(request.getBookingId());
    }
    
    public InspectionResponseDTO getInspectionByReceptionId(Integer receptionId) {
        InspectionEntity inspection = inspectionRepository.findByReception_ReceptionId(receptionId)
                .orElse(null);
        
        if (inspection == null) {
            return null;
        }
        
        return convertToReceptionInspectionDTO(inspection);
    }
    
    private InspectionResponseDTO convertToReceptionInspectionDTO(InspectionEntity inspection) {
        VehicleReceptionEntity reception = inspection.getReception();
        
        List<InspectionItemEntity> items = inspectionItemRepository
                .findByInspection_InspectionId(inspection.getInspectionId());
        
        List<InspectionResponseDTO.InspectionItemResponseDTO> itemDTOs = items.stream()
                .map(item -> InspectionResponseDTO.InspectionItemResponseDTO.builder()
                        .itemId(item.getItemId())
                        .sparePartId(item.getSparePart().getSparePartId())
                        .sparePartName(item.getSparePart().getSparePartName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .issueDescription(item.getIssueDescription())
                        .isCritical(item.getIsCritical())
                        .build())
                .collect(Collectors.toList());
        
        return InspectionResponseDTO.builder()
                .inspectionId(inspection.getInspectionId())
                .bookingId(reception.getReceptionId()) // Use receptionId as bookingId for frontend compatibility
                .technicianName(inspection.getTechnician().getFullName())
                .status(inspection.getStatus().name())
                .generalNotes(inspection.getGeneralNotes())
                .batteryHealth(inspection.getBatteryHealth())
                .motorCondition(inspection.getMotorCondition())
                .brakeCondition(inspection.getBrakeCondition())
                .tireCondition(inspection.getTireCondition())
                .electricalSystem(inspection.getElectricalSystem())
                .estimatedCost(inspection.getEstimatedCost())
                .estimatedTimeHours(inspection.getEstimatedTimeHours())
                .inspectionDate(inspection.getInspectionDate())
                .items(itemDTOs)
                .vehicleModel(reception.getVehicleModel())
                .licensePlate(reception.getLicensePlate())
                .customerName(reception.getCustomerName())
                .customerPhone(reception.getCustomerPhone())
                .build();
    }
}
