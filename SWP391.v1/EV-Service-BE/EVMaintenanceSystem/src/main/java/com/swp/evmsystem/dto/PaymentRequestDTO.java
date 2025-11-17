package com.swp.evmsystem.dto;

import com.swp.evmsystem.enums.PaymentMethod;
import com.swp.evmsystem.enums.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
    private Integer receptionId;
    private Integer bookingId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String vehicleInfo;
    private String licensePlate;
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceDate;
    private Double totalAmount;
    private Double discountAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String notes;
}
