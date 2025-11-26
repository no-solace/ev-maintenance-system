package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.request.VehicleReceptionRequest;
import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.model.*;
import com.swp.evmsystem.enums.*;
import com.swp.evmsystem.exception.BusinessException;
import com.swp.evmsystem.exception.ResourceNotFoundException;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.service.InspectionRecordService;
import com.swp.evmsystem.service.VehicleReceptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleReceptionServiceImpl implements VehicleReceptionService {

    private final VehicleReceptionRepository receptionRepository;
    private final EmployeeRepository employeeRepository;
    private final MaintenancePackageRepository maintenancePackageRepository;
    private final SparePartRepository sparePartRepository;
    private final BookingRepository bookingRepository;
    private final ElectricVehicleRepository electricVehicleRepository;
    private final InspectionRecordService inspectionRecordService;
    private final ReceptionSparePartRepository receptionSparePartRepository;
    private final CenterRepository centerRepository;

    @Override
    @Transactional
    public VehicleReceptionResponseDTO createReception(VehicleReceptionRequest request, Integer centerId) {
        BookingEntity booking = null;
        MaintenancePackageEntity maintenancePackage = null;
        EmployeeEntity technician = null;
        ServiceCenterEntity center = centerRepository.findById(centerId).orElse(null);
        
        // Get technician if provided (optional)
        if (request.getTechnicianId() != null) {
            technician = getTechnicianById(request.getTechnicianId());
            // Validate technician availability and set to ON_WORKING
            validateTechnicianAvailability(technician);
            technician.setWorkingStatus(WorkingStatus.ON_WORKING);
            employeeRepository.save(technician);
        }

        // Validate the reception type: walk-in or booking
        if (request.getBookingId() == null) {
            ElectricVehicleEntity vehicle = getVehicleByPlate(request.getLicensePlate());
            validateVehicleAvailability(vehicle);
        } else {
            booking = getBookingEntityById(request.getBookingId());
            validateBookingForReception(booking, centerId);
            booking.setStatus(BookingStatus.VISITED);
            bookingRepository.save(booking);
        }

        // Get maintenance package if selected
        if (request.getSelectedMaintenancePackages() != null) {
            Integer packageId = request.getSelectedMaintenancePackages();
            maintenancePackage = getMaintenancePackageEntityById(packageId);
        }

        // Calculate total cost from selected packages and spare parts
        double totalCost = calculateTotalCostFromItems(
                request.getSelectedMaintenancePackages(),
                request.getSelectedSpareParts()
        );

        // Create entity (spare parts will be added later via addSpareParts method)
        VehicleReceptionEntity entity = VehicleReceptionEntity.builder()
                .booking(booking)  // Link to booking (null for walk-ins)
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .customerAddress(request.getCustomerAddress())
                .vehicleModel(request.getVehicleModel())
                .licensePlate(request.getLicensePlate())
                .mileage(request.getMileage())
                .center(center)
                .assignedTechnician(technician)
                .maintenancePackage(maintenancePackage)
                .issueDescription(request.getIssueDescription())
                .notes(request.getNotes())
                .totalCost(totalCost)
                .status(ReceptionStatus.valueOf("RECEIVED"))
                .build();

        // Save to database
        VehicleReceptionEntity savedEntity = saveReceptionEntity(entity);
        if (request.getSelectedSpareParts() != null && !request.getSelectedSpareParts().isEmpty()) {
            log.info("✅ Processing {} spare parts", request.getSelectedSpareParts().size());
            List<SparePartEntity> selectedParts = sparePartRepository.findAllById(request.getSelectedSpareParts());
            log.info("✅ Found {} spare parts in database", selectedParts.size());

            for (SparePartEntity part : selectedParts) {
                if (part.getQuantity() <= 0) {
                    throw new IllegalStateException("Spare part " + part.getSparePartName() + " is out of stock");
                }

                // Create spare part request
                ReceptionSparePartEntity sparePartRequest =
                        ReceptionSparePartEntity.builder()
                                .reception(savedEntity)
                                .sparePart(part)
                                .quantity(1)
                                .unitPrice(part.getPrice().doubleValue())
                                .status(SparePartRequestStatus.PENDING)
                                .requestedAt(LocalDateTime.now())
                                .isCritical(false)
                                .build();

                receptionSparePartRepository.save(sparePartRequest);

                // Reduce spare part quantity
                part.setQuantity(part.getQuantity() - 1);
                if (part.getQuantity() == 0) {
                    part.setInStock(false);
                }
                sparePartRepository.save(part);
            }
        }

        // Tự động tạo InspectionRecords từ MaintenancePackage
        if (maintenancePackage != null) {
            inspectionRecordService.createRecordsFromPackage(savedEntity);
        }

        // Update vehicle maintenance status to IN_SERVICE
        var vehicleOpt = electricVehicleRepository.findByLicensePlate(request.getLicensePlate());
        if (vehicleOpt.isPresent()) {
            ElectricVehicleEntity vehicle = vehicleOpt.get();
            vehicle.setMaintenanceStatus(EvMaintenanceStatus.IN_SERVICE);
            electricVehicleRepository.save(vehicle);
            log.info("Updated vehicle {} maintenance status to IN_SERVICE", request.getLicensePlate());
        }

        // Convert to response DTO
        return convertToResponseDTO(savedEntity);
    }

    private MaintenancePackageEntity getMaintenancePackageEntityById(Integer packageId) {
        return maintenancePackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance package not found with id: " + packageId));
    }

    private BookingEntity getBookingEntityById(Integer bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
    }

    @Override
    public VehicleReceptionResponseDTO getReceptionById(Integer receptionId, Integer centerId) {
        VehicleReceptionEntity entity = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
        validateCenterAccess(entity, centerId);
        return convertToResponseDTO(entity);
    }

    @Override
    public List<VehicleReceptionResponseDTO> getReceptions(Integer centerId) {
        List<VehicleReceptionEntity> receptions = receptionRepository.findAllByCenter_Id(centerId);

        return receptions.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleReceptionResponseDTO> getReceptionsByStatus(String status, Integer centerId) {
        List<VehicleReceptionEntity> receptions = receptionRepository.findByStatus(ReceptionStatus.valueOf(status));
        receptions = filterByCenter(receptions, centerId);
        return receptions.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleReceptionResponseDTO> getReceptionsByTechnician(Integer technicianId, Integer centerId) {
        List<VehicleReceptionEntity> receptions = receptionRepository.findByAssignedTechnicianId(technicianId);
        receptions = filterByCenter(receptions, centerId);
        return receptions.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VehicleReceptionResponseDTO updateReceptionStatus(Integer receptionId, String status, Integer centerId, Integer userId, String userRole) {
        VehicleReceptionEntity reception = getVehicleReceptionEntityById(receptionId);
        var vehicleOpt = electricVehicleRepository.findByLicensePlate(reception.getLicensePlate());

        validateCenterAccess(reception, centerId);
        
        // Convert string to enum
        ReceptionStatus newStatus = ReceptionStatus.valueOf(status);
        
        // Business rule: Only TECHNICIAN can set IN_PROGRESS or COMPLETED
        if ((newStatus == ReceptionStatus.IN_PROGRESS || newStatus == ReceptionStatus.COMPLETED) 
            && !"TECHNICIAN".equals(userRole)) {
            throw new BusinessException("Chỉ kỹ thuật viên mới có quyền cập nhật trạng thái IN_PROGRESS hoặc COMPLETED");
        }
        
        // If technician is updating, verify they are assigned to this reception
        if ("TECHNICIAN".equals(userRole)) {
            if (reception.getAssignedTechnician() == null || !reception.getAssignedTechnician().getId().equals(userId)) {
                throw new BusinessException("Bạn không được phân công cho phiếu tiếp nhận này");
            }
        }
        
        reception.setStatus(newStatus);

        // Set completedAt timestamp when status becomes COMPLETED
        if (newStatus == ReceptionStatus.COMPLETED && reception.getCompletedAt() == null) {
            reception.setCompletedAt(java.time.LocalDateTime.now());
            log.info("✅ Set completedAt for reception #{}", receptionId);
        }

        // Update vehicle maintenance status
        if (vehicleOpt.isPresent()) {
            ElectricVehicleEntity vehicle = vehicleOpt.get();

            if (newStatus == ReceptionStatus.RECEIVED || newStatus == ReceptionStatus.ASSIGNED) {
                vehicle.setMaintenanceStatus(EvMaintenanceStatus.IN_SERVICE);
                electricVehicleRepository.save(vehicle);
            } else if (newStatus == ReceptionStatus.COMPLETED) {
                vehicle.setMaintenanceStatus(EvMaintenanceStatus.COMPLETED);
                electricVehicleRepository.save(vehicle);
            }
        }

        // Update linked booking status if exists
        if (reception.getBooking() != null && newStatus == ReceptionStatus.COMPLETED) {
            BookingEntity booking = reception.getBooking();
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
            log.info("Updated booking #{} status to COMPLETED", booking.getBookingId());
        }

        // Update technician working status based on reception status
        if (reception.getAssignedTechnician() != null) {
            EmployeeEntity technician = reception.getAssignedTechnician();

            if (newStatus == ReceptionStatus.COMPLETED || newStatus == ReceptionStatus.PAID) {
                // Check if technician has any other active receptions
                long activeReceptions = receptionRepository.countByAssignedTechnicianAndStatusNotIn(
                        technician,
                        Arrays.asList(ReceptionStatus.COMPLETED, ReceptionStatus.PAID)
                );

                // If no other active receptions, set status to AVAILABLE
                if (activeReceptions == 0) {
                    technician.setWorkingStatus(com.swp.evmsystem.enums.WorkingStatus.AVAILABLE);
                    employeeRepository.save(technician);
                }
            }
        }

        VehicleReceptionEntity updatedEntity = saveReceptionEntity(reception);

        return convertToResponseDTO(updatedEntity);
    }

    @Override
    @Transactional
    public VehicleReceptionResponseDTO addSpareParts(Integer receptionId, List<Integer> sparePartIds, Integer centerId) {
        VehicleReceptionEntity reception = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
        validateCenterAccess(reception, centerId);

        // Fetch spare parts
        List<SparePartEntity> spareParts = sparePartRepository.findAllById(sparePartIds);

        double additionalCost = 0.0;

        // Create ReceptionSparePart entities with default values
        for (SparePartEntity part : spareParts) {
            if (part.getQuantity() <= 0) {
                throw new IllegalStateException("Spare part " + part.getSparePartName() + " is out of stock");
            }

            // Create spare part request with default quantity = 1
            com.swp.evmsystem.model.ReceptionSparePartEntity sparePartRequest = com.swp.evmsystem.model.ReceptionSparePartEntity.builder()
                    .reception(reception)
                    .sparePart(part)
                    .quantity(1)
                    .unitPrice(part.getPrice().doubleValue())
                    // totalPrice is calculated via @Transient method
                    .status(com.swp.evmsystem.enums.SparePartRequestStatus.PENDING)
                    .requestedAt(java.time.LocalDateTime.now())
                    .isCritical(false)
                    .build();

            receptionSparePartRepository.save(sparePartRequest);

            // Reduce spare part quantity
            part.setQuantity(part.getQuantity() - 1);
            if (part.getQuantity() == 0) {
                part.setInStock(false);
            }
            sparePartRepository.save(part);

            additionalCost += part.getPrice();
        }

        // Update total cost
        double currentCost = reception.getTotalCost() != null ? reception.getTotalCost() : 0.0;
        reception.setTotalCost(currentCost + additionalCost);

        // Save and return
        VehicleReceptionEntity updatedEntity = receptionRepository.save(reception);
        return convertToResponseDTO(updatedEntity);
    }


    @Override
    @Transactional
    public VehicleReceptionResponseDTO assignTechnician(Integer receptionId, Integer technicianId, Integer centerId) {
        VehicleReceptionEntity reception = getVehicleReceptionEntityById(receptionId);
        EmployeeEntity technician = getTechnicianById(technicianId);

        validateTechnicianAvailability(technician);

        // If reception already has a technician, update their status
        if (reception.getAssignedTechnician() != null) {
            EmployeeEntity oldTechnician = reception.getAssignedTechnician();

            // Check if old technician has other active receptions
            long activeReceptions = receptionRepository.countByAssignedTechnicianAndStatusNotIn(
                    oldTechnician,
                    Arrays.asList(ReceptionStatus.ASSIGNED, ReceptionStatus.COMPLETED, ReceptionStatus.PAID)
            );

            // If no other active receptions, set old technician to AVAILABLE
            if (activeReceptions == 1) { // Only this reception
                oldTechnician.setWorkingStatus(WorkingStatus.AVAILABLE);
                employeeRepository.save(oldTechnician);
            }
        }

        // Assign new technician
        reception.setAssignedTechnician(technician);

        // Update new technician status to ON_WORKING
        technician.setWorkingStatus(com.swp.evmsystem.enums.WorkingStatus.ON_WORKING);
        employeeRepository.save(technician);

        // Save reception
        VehicleReceptionEntity updatedReception = saveReceptionEntity(reception);

        return convertToResponseDTO(updatedReception);
    }

    private VehicleReceptionEntity saveReceptionEntity(VehicleReceptionEntity reception) {
        return receptionRepository.save(reception);
    }

    // Helper methods

    private double calculateTotalCostFromItems(
            Integer packageId,
            List<Integer> sparePartIds
    ) {
        double total = 0.0;

        // Add maintenance package costs
        if (packageId != null) {
            MaintenancePackageEntity selectedPackage = getMaintenancePackageEntityById(packageId);
            total += selectedPackage.getPrice();
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
        // Build comprehensive services list
        List<String> services = new ArrayList<>();
        Integer packageId = null;
        String packageName = null;
        Integer packagePrice = null;

        // Add maintenance package if available
        if (entity.getMaintenancePackage() != null) {
            packageId = entity.getMaintenancePackage().getPackageId();
            packageName = entity.getMaintenancePackage().getPackageName();
            packagePrice = entity.getMaintenancePackage().getPrice();

            // Add service type based on offerType instead of package name
            OfferType offerType = entity.getMaintenancePackage().getOfferType();
            switch (offerType) {
                case MAINTENANCE:
                    services.add("Bảo dưỡng định kỳ");
                    break;
                case REPLACEMENT:
                    services.add("Thay thế linh kiện");
                    break;
                case REPAIR:
                    services.add("Sửa chữa");
                    break;
                default:
                    services.add(packageName);
            }
        }

        // Add spare parts replacement service if any parts are selected
        if (entity.getSparePartRequests() != null && !entity.getSparePartRequests().isEmpty()) {
            int partCount = entity.getSparePartRequests().size();
            services.add("Thay thế phụ tùng (" + partCount + " chi tiết)");
        }

        // Add repair service if issue description exists
        if (entity.getIssueDescription() != null && !entity.getIssueDescription().trim().isEmpty()) {
            services.add("Sửa chữa kỹ thuật");
        }

        // If no services at all, add default
        if (services.isEmpty()) {
            services.add("Chưa chọn dịch vụ");
        }

        // Build spare parts list
        List<VehicleReceptionResponseDTO.SparePartInfo> sparePartsList = new ArrayList<>();
        if (entity.getSparePartRequests() != null && !entity.getSparePartRequests().isEmpty()) {
            for (ReceptionSparePartEntity request : entity.getSparePartRequests()) {
                sparePartsList.add(VehicleReceptionResponseDTO.SparePartInfo.builder()
                        .sparePartId(request.getSparePart().getSparePartId())
                        .sparePartName(request.getSparePart().getSparePartName())
                        .quantity(request.getQuantity())
                        .unitPrice(request.getUnitPrice())
                        .requestedAt(request.getRequestedAt())
                        .build());
            }
        }
        
        // Build inspection records list (only for COMPLETED or PAID status)
        List<VehicleReceptionResponseDTO.InspectionRecordInfo> inspectionRecordsList = new ArrayList<>();
        if ((entity.getStatus() == ReceptionStatus.COMPLETED || entity.getStatus() == ReceptionStatus.PAID) 
            && entity.getInspectionRecords() != null && !entity.getInspectionRecords().isEmpty()) {
            for (InspectionRecordEntity record : entity.getInspectionRecords()) {
                inspectionRecordsList.add(VehicleReceptionResponseDTO.InspectionRecordInfo.builder()
                        .recordId(record.getRecordId())
                        .taskCategory(record.getInspectionTask() != null ? record.getInspectionTask().getCategory().name() : null)
                        .taskDescription(record.getInspectionTask() != null ? record.getInspectionTask().getDescription() : null)
                        .actualStatus(record.getActionType() != null ? record.getActionType().name() : null)
                        .checkedAt(record.getCheckedAt())
                        .build());
            }
        }

        log.debug("📦 Converting entity to DTO: receptionId={}, status={}, createdAt={}", 
                entity.getReceptionId(), entity.getStatus(), entity.getCreatedAt());
        
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
                .services(services)
                .packageId(packageId)
                .packageName(packageName)
                .packagePrice(packagePrice)
                .spareParts(sparePartsList)
                .inspectionRecords(inspectionRecordsList)
                .technicianName(entity.getAssignedTechnician() != null ? entity.getAssignedTechnician().getFullName() : null)
                .technicianId(entity.getAssignedTechnician() != null ? entity.getAssignedTechnician().getId() : null)
                .notes(entity.getNotes())
                .totalCost(entity.getTotalCost())
                .status(entity.getStatus() != null ? entity.getStatus().name() : "RECEIVED")
                .createdAt(entity.getCreatedAt())
                .completedAt(entity.getCompletedAt())
                .build();
    }

    @Override
    public List<SparePartEntity> getSpareParts(Integer receptionId, Integer centerId) {
        VehicleReceptionEntity reception = getVehicleReceptionEntityById(receptionId);

        validateCenterAccess(reception, centerId);
        return reception.getSpareParts();
    }

    @Override
    public List<OfferTypeDTO> getAllOfferTypes() {
        return Arrays.stream(OfferType.values())
                .map(type -> OfferTypeDTO.builder()
                        .id(type.ordinal() + 1)
                        .name(type.getName())
                        .description(type.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleReceptionResponseDTO> getWalkinReceptionsByCenter(Integer centerId) {

        // Get receptions with no booking, in FIFO order (createdAt ASC)
        List<VehicleReceptionEntity> walkinReceptions = receptionRepository
                .findWalkinReceptionsByCenterAndStatus(centerId, ReceptionStatus.RECEIVED);
        
        return walkinReceptions.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<VehicleReceptionResponseDTO> getReceptionsByCustomerId(Integer customerId) {
        List<VehicleReceptionEntity> receptions = receptionRepository.findByCustomerId(customerId);
        
        return receptions.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Validate center access
     *
     * @param reception the reception to check
     * @param centerId  null for admin (no check), specific ID for staff/technician
     */
    private void validateCenterAccess(VehicleReceptionEntity reception, Integer centerId) {
        // Admin has access to all (centerId == null)
        if (centerId == null) {
            return;
        }

        // Check if reception belongs to the specified center
        if (reception.getCenter() == null || !Objects.equals(reception.getCenter().getId(), centerId)) {
            throw new BusinessException("You don't have access to this reception");
        }
    }

    private ElectricVehicleEntity getVehicleByPlate(String plate) {
        return electricVehicleRepository.findByLicensePlate(plate)
                .orElseThrow(() -> new IllegalStateException(
                        "Xe với biển số " + plate +
                                " không có trong hệ thống. Vui lòng đăng ký xe trước khi tiếp nhận."));
    }

    /**
     * Filter receptions by center
     *
     * @param receptions list of receptions to filter
     * @param centerId   null for admin (no filter), specific ID for staff/technician
     */
    private List<VehicleReceptionEntity> filterByCenter(List<VehicleReceptionEntity> receptions, Integer centerId) {
        if (centerId == null) {
            return receptions; // Admin sees all
        }

        return receptions.stream()
                .filter(r -> r.getCenter() != null && Objects.equals(r.getCenter().getId(), centerId))
                .collect(Collectors.toList());
    }

    private EmployeeEntity getTechnicianById(Integer technicianId) {
        return employeeRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + technicianId));
    }

    private void validateTechnicianAvailability(EmployeeEntity technician) {
        if (technician.getWorkingStatus() != WorkingStatus.AVAILABLE) {
            throw new IllegalStateException("Cannot assign technician who is off duty");
        }
    }

    private void validateVehicleAvailability(ElectricVehicleEntity vehicle) {
        if (vehicle.getMaintenanceStatus() != EvMaintenanceStatus.AVAILABLE) {
            log.warn("Vehicle reception rejected - vehicle not available: {} (status: {})",
                    vehicle.getLicensePlate(), vehicle.getMaintenanceStatus());
            throw new IllegalStateException(
                    "Xe với biển số " + vehicle.getLicensePlate() +
                            " đang có trạng thái " + vehicle.getMaintenanceStatus() +
                            ". Chỉ có thể tiếp nhận xe có trạng thái AVAILABLE."
            );
        }
    }

    private VehicleReceptionEntity getVehicleReceptionEntityById(Integer receptionId) {
        return receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reception not found with id: " + receptionId));
    }

    private void validateBookingForReception(BookingEntity booking, Integer centerId) {
        if (!booking.getBookingDate().equals(LocalDate.now())) {
            throw new IllegalStateException(
                    "Chỉ có thể tạo reception vào đúng ngày đặt lịch. " +
                            "Ngày đặt lịch: " + booking.getBookingDate() + ", " + "Ngày hiện tại: " + LocalDate.now()
            );
        }

        if (!Integer.valueOf(booking.getCenter().getId()).equals(centerId)) {
            throw new IllegalStateException(
                    "Booking không được đặt ở trung tâm này."
            );
        }
    }
}
