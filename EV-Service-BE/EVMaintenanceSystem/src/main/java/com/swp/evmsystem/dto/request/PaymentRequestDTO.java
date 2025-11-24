package com.swp.evmsystem.dto.request;

import com.swp.evmsystem.enums.PaymentMethod;
import com.swp.evmsystem.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
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
