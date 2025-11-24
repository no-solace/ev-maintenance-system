package com.swp.evmsystem.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.swp.evmsystem.validation.annotation.ValidBookingDateTime;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ValidBookingDateTime
public class BookingRequest {
    // Vehicle and Service Center
    @JsonProperty("eVId")
    @NotNull(message = "Vehicle ID is required")
    Integer eVId;
    
    @NotNull(message = "Service center ID is required")
    Integer centerId;

    @NotNull(message = "Booking date is required")
    LocalDate bookingDate;
    
    @NotNull(message = "Booking time is required")
    LocalTime bookingTime;
    
    @NotBlank(message = "Name is required")
    String customerName;
    
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    String customerPhone;
    
    @Email(message = "Email must be valid")
    String customerEmail;
    
    String customerAddress;

    String notes;
}
