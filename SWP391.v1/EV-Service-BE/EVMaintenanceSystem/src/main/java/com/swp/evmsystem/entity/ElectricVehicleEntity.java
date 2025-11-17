package com.swp.evmsystem.entity;

import com.swp.evmsystem.enums.EvMaintenanceStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "xe_dien")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class ElectricVehicleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    int id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model")
    EvModelEntity model;
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
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    CustomerEntity owner;
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_status", length = 20, nullable = false)
    EvMaintenanceStatus maintenanceStatus = EvMaintenanceStatus.AVAILABLE;
}
