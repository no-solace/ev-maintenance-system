package com.swp.evmsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "tiep_nhan_xe")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class VehicleReceptionEntity {
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
    
    // Services (stored as comma-separated values)
    @Column(name = "services", length = 500, nullable = false)
    String services;
    
    // Assigned technician
    @ManyToOne
    @JoinColumn(name = "technician_id", referencedColumnName = "user_id", nullable = false)
    EmployeeEntity assignedTechnician;
    
    // Notes
    @Column(name = "notes", length = 1000)
    String notes;
    
    // Cost and status
    @Column(name = "total_cost")
    Double totalCost;
    
    @Column(name = "status", length = 20, nullable = false)
    String status;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "RECEIVED";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
