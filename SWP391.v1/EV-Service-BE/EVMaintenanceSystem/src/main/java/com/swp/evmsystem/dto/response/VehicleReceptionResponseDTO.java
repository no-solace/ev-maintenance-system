package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReceptionResponseDTO {
    Integer receptionId;
    Integer bookingId;  // Link to booking (null for walk-ins)
    String customerName;
    String customerPhone;
    String customerEmail;
    String customerAddress;
    String vehicleModel;
    String licensePlate;
    Integer mileage;
    List<String> services;
    String technicianName;
    Integer technicianId;
    String notes;
    Double totalCost;
    String status;
    LocalDateTime createdAt;
}
