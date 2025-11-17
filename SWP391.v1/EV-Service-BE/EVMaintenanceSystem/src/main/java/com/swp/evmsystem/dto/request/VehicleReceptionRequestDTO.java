package com.swp.evmsystem.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleReceptionRequestDTO {
    // Link to booking (optional - for bookings, null for walk-ins)
    Integer bookingId;
    
    // Customer information
    @NotBlank(message = "Customer name is required")
    String customerName;
    
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^0[0-9]{9}$", message = "Phone number must be 10 digits starting with 0")
    String customerPhone;
    
    String customerEmail;
    
    String customerAddress;
    
    // Vehicle information
    @NotBlank(message = "Vehicle model is required")
    String vehicleModel;
    
    @NotBlank(message = "License plate is required")
    String licensePlate;
    
    @NotNull(message = "Mileage is required")
    Integer mileage;
    
    // Services
    List<String> services;

    List<Integer> selectedMaintenancePackages;
    List<Integer> selectedSpareParts;
    List<Integer> selectedIssues;
    
    // Assigned technician
    @NotNull(message = "Technician must be assigned")
    Integer technicianId;
    
    // Notes
    String notes;
}
