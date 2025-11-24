package com.swp.evmsystem.entity;

import com.swp.evmsystem.enums.InspectionStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * Bản ghi kiểm tra thực tế khi thực hiện bảo dưỡng
 * Đây là instance/record của InspectionTaskEntity (template)
 */
@Entity
@Table(name = "ban_ghi_kiem_tra")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InspectionRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    Integer recordId;

    // Link to the template inspection task
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    InspectionTaskEntity inspectionTask;

    // Link to vehicle reception (the actual service session)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reception_id", nullable = false)
    VehicleReceptionEntity vehicleReception;

    // Action type: PENDING, INSPECT, CLEAN, REPLACE, LUBRICATE
    @Enumerated(EnumType.STRING)
    @Column(name = "actual_status", nullable = false, length = 20)
    @Builder.Default
    InspectionStatus actionType = InspectionStatus.PENDING;

    // Timestamp when this action was performed
    @Column(name = "checked_at")
    LocalDateTime checkedAt;
}