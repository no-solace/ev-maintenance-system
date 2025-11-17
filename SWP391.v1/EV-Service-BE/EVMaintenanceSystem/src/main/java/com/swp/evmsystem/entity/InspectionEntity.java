package com.swp.evmsystem.entity;

import com.swp.evmsystem.enums.InspectionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "kiem_tra")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InspectionEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inspection_id")
    Integer inspectionId;
    
    @ManyToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "booking_id")
    BookingEntity booking;
    
    @ManyToOne
    @JoinColumn(name = "reception_id", referencedColumnName = "reception_id")
    VehicleReceptionEntity reception;
    
    @ManyToOne
    @JoinColumn(name = "technician_id", referencedColumnName = "user_id")
    EmployeeEntity technician;
    
    @Column(name = "inspection_date")
    LocalDateTime inspectionDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    InspectionStatus status;
    
    @Column(name = "general_notes", length = 2000)
    String generalNotes;
    
    @Column(name = "battery_health", length = 50)
    String batteryHealth;
    
    @Column(name = "motor_condition", length = 50)
    String motorCondition;
    
    @Column(name = "brake_condition", length = 50)
    String brakeCondition;
    
    @Column(name = "tire_condition", length = 50)
    String tireCondition;
    
    @Column(name = "electrical_system", length = 50)
    String electricalSystem;
    
    @Column(name = "estimated_cost")
    Double estimatedCost;
    
    @Column(name = "estimated_time_hours")
    Integer estimatedTimeHours;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
@Column(name = "updated_at")
    LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "inspection", fetch = FetchType.LAZY)
    List<InspectionItemEntity> items;
}
