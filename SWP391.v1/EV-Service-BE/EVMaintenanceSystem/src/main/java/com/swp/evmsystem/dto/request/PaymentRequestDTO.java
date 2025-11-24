package com.swp.evmsystem.dto.request;

import com.swp.evmsystem.enums.PaymentMethod;
import com.swp.evmsystem.enums.PaymentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @NotBlank(message = "Tên không được để trống")
    private String customerName;
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
    private String customerPhone;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
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
