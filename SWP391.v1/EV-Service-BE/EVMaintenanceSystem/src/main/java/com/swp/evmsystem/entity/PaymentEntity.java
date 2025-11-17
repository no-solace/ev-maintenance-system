package com.swp.evmsystem.entity;

import com.swp.evmsystem.enums.PaymentMethod;
import com.swp.evmsystem.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_toan")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    Integer paymentId;
    
    // Reference to vehicle reception (source of the payment)
    // Nullable because payments can also be for booking deposits without reception
    @ManyToOne
    @JoinColumn(name = "reception_id", referencedColumnName = "reception_id", nullable = true)
    VehicleReceptionEntity reception;
    
    // Reference to booking (for deposit payments)
    // Nullable because payments from receptions don't have a booking
    @ManyToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id", nullable = true)
    BookingEntity booking;
    
    // Invoice information
    @Column(name = "invoice_number", length = 20, unique = true, nullable = false)
    String invoiceNumber;
    
    // Customer information (denormalized for invoice)
    @Column(name = "customer_name", length = 100, nullable = false)
    String customerName;
    
    @Column(name = "customer_phone", length = 10, nullable = false)
    String customerPhone;
    
    @Column(name = "customer_email", length = 100)
    String customerEmail;
    
    // Vehicle information
    @Column(name = "vehicle_info", length = 200, nullable = false)
    String vehicleInfo;
    
    @Column(name = "license_plate", length = 15, nullable = false)
    String licensePlate;
    
    // Service details
    @Column(name = "service_name", length = 200, nullable = false)
    String serviceName;
    
    @Column(name = "service_description", length = 1000)
    String serviceDescription;
    
    @Column(name = "service_date")
    LocalDateTime serviceDate;
    
    // Payment details
    @Column(name = "total_amount", nullable = false)
    Double totalAmount;
    
    @Column(name = "discount_amount")
    Double discountAmount;
    
    @Column(name = "final_amount", nullable = false)
    Double finalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20, nullable = false)
    PaymentStatus paymentStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    PaymentMethod paymentMethod;
    
    @Column(name = "payment_date")
    LocalDateTime paymentDate;
    
    @Column(name = "notes", length = 500)
    String notes;
    
    // Staff who processed payment
    @ManyToOne
    @JoinColumn(name = "processed_by", referencedColumnName = "user_id")
    EmployeeEntity processedBy;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
        if (discountAmount == null) {
            discountAmount = 0.0;
        }
        if (finalAmount == null && totalAmount != null) {
            finalAmount = totalAmount - discountAmount;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
