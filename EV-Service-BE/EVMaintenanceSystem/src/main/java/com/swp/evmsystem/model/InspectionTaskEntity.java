package com.swp.evmsystem.model;

import com.swp.evmsystem.enums.InspectionCategory;
import com.swp.evmsystem.enums.KmInterval;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


/**
 * InspectionTask is a template/master data used for creating InspectionRecord for each EV maintenance appointment.
 * It's kind of Value Object
 */

@Entity
@Table(name = "hang_muc_kiem_tra")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InspectionTaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    InspectionCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "km_interval", nullable = false, length = 20)
    KmInterval kmInterval;

    @Column(name = "description", nullable = false, length = 255)
    String description;
}
