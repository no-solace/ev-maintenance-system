package com.swp.evmsystem.model;

import com.swp.evmsystem.enums.EvMaintenanceStatus;
import com.swp.evmsystem.enums.VehicleModel;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "xe_dien")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class ElectricVehicleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    Integer id;
    @Enumerated(EnumType.STRING)
    @Column(name = "model", nullable = false)
    VehicleModel model;
    @Column(name = "vin", length = 17, unique = true, nullable = false)
    String vin;
    @Column(name = "license_plate", length = 10, nullable = false)
    String licensePlate;
    @Column(name = "warranty")
    Boolean hasWarranty = false;
    @Column(name = "warranty_start_date")
    LocalDate warrantyStartDate;
    @Column(name = "warranty_end_date")
    LocalDate warrantyEndDate;
    @Column(name = "warranty_years")
    Integer warrantyYears;
    @Column(name = "purchase_date")
    LocalDate purchaseDate;
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    CustomerEntity owner;
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_status", length = 20, nullable = false)
    EvMaintenanceStatus maintenanceStatus = EvMaintenanceStatus.AVAILABLE;
}
