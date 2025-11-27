package com.swp.evmsystem.model;

import com.swp.evmsystem.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "lich_hen")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class BookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    Integer bookingId;

    @Column(name = "customer_name", length = 100, nullable = false)
    String customerName;

    @Column(name = "customer_phone", length = 10, nullable = false)
    String customerPhone;

    @Column(name = "customer_email", length = 100)
    String customerEmail;

    @Column(name = "customer_address", length = 255)
    String customerAddress;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", referencedColumnName = "vehicle_id", nullable = false)
    VehicleEntity vehicle;

    @ManyToOne
    @JoinColumn(name = "center_id", referencedColumnName = "center_id", nullable = false)
    ServiceCenterEntity center;

    @Column(name = "booking_date", nullable = false, columnDefinition = "DATE")
    LocalDate bookingDate;

    @Column(name = "booking_time", nullable = false, columnDefinition = "TIME")
    LocalTime bookingTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    BookingStatus status;

    @Column(name = "notes", length = 500)
    String notes;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}