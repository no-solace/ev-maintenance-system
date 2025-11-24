package com.swp.evmsystem.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class ElectricVehicleDTO {
    int id;
    String model;
    String vin;
    String licensePlate;
    LocalDate warrantyStartDate;
    LocalDate warrantyEndDate;
    Integer warrantyYears;
    LocalDate purchaseDate;
    Boolean hasWarranty;
    String maintenanceStatus;
    OwnerDTO owner;
}
