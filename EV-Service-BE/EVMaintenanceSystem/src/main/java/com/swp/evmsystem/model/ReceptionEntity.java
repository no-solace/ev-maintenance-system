package com.swp.evmsystem.model;

import com.swp.evmsystem.enums.ReceptionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "phieu_tiep_nhan")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class ReceptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reception_id")
    Integer receptionId;
    
    // Link to booking (optional - null for walk-ins)
    @ManyToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id")
    BookingEntity booking;
    
    // Customer information
    @Column(name = "customer_name", length = 100, nullable = false)
    String customerName;
    
    @Column(name = "customer_phone", length = 10, nullable = false)
    String customerPhone;
    
    @Column(name = "customer_email", length = 100)
    String customerEmail;
    
    @Column(name = "customer_address", length = 255)
    String customerAddress;
    
    // Vehicle information
    @Column(name = "vehicle_model", length = 50, nullable = false)
    String vehicleModel;
    
    @Column(name = "license_plate", length = 15, nullable = false)
    String licensePlate;
    
    @Column(name = "mileage")
    Integer mileage;

    // Assigned technician
    @ManyToOne
    @JoinColumn(name = "technician_id", referencedColumnName = "user_id")
    EmployeeEntity assignedTechnician;

    @ManyToOne
    @JoinColumn(name = "center_id", referencedColumnName = "center_id", nullable = false)
    ServiceCenterEntity center;

    // Maintenance package selected for this reception (template/definition only)
    @ManyToOne
    @JoinColumn(name = "package_id", referencedColumnName = "package_id")
    MaintenancePackageEntity maintenancePackage;
    
    // List of actual inspection records for this reception (created from package tasks)
    @OneToMany(mappedBy = "vehicleReception", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<InspectionRecordEntity> inspectionRecords = new ArrayList<>();
    
    // Issue description for repair service
    @Column(name = "issue_description", length = 1000)
    String issueDescription;
    
    // List of spare part requests for this reception (with detailed information)
    @OneToMany(mappedBy = "reception", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<ReceptionSparePartEntity> sparePartRequests = new ArrayList<>();
    
    // Helper method to get list of spare parts (for backward compatibility)
    public List<SparePartEntity> getSpareParts() {
        if (sparePartRequests == null) {
            return new ArrayList<>();
        }
        return sparePartRequests.stream()
                .map(ReceptionSparePartEntity::getSparePart)
                .collect(java.util.stream.Collectors.toList());
    }
    
    // Notes
    @Column(name = "notes", length = 1000)
    String notes;
    
    // Cost and status
    @Column(name = "total_cost")
    Double totalCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    ReceptionStatus status = ReceptionStatus.RECEIVED;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (!(assignedTechnician == null)) {
            status = ReceptionStatus.ASSIGNED;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
