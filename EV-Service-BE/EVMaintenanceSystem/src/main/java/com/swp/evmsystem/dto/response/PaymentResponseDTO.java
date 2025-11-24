package com.swp.evmsystem.dto.response;

import com.swp.evmsystem.enums.PaymentMethod;
import com.swp.evmsystem.enums.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
    private Integer paymentId;
    private Integer receptionId;
    private Integer bookingId;
    private String invoiceNumber;
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
    private Double finalAmount;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDate;
    private String notes;
    private Integer processedByUserId;
    private String processedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
