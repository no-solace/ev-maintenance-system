package com.swp.evmsystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDTO {
    Integer bookingId;
    String center;
    String address;
    String date;
    String time;
    String bookingDate;  // Added for clarity
    String bookingTime;  // Added for clarity
    String eVModel;
    String vehicleModel; // Added
    String licensePlate;
    String vin;
    Boolean hasWarranty;
    String warrantyEndDate;
    String customerName;
    String customerEmail; // Added
    String customerPhone;
    String customerAddress; // Added new field
    String notes;
    String status;
    LocalDateTime createdAt; // Added
    String vehicleMake;
    
    // Payment fields
    Integer paymentId;
    Long depositAmount;
    String paymentStatus;
    String paymentUrl;
}
