package com.swp.evmsystem.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Entity
@Table(name = "trung_tam")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ServiceCenterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_id")
    int id;
    @Column(name = "center_name", length = 100, nullable = false)
    String centerName;
    @Column(name = "center_phone", length = 12, nullable = false)
    String centerPhone;
    @Column(name = "start_time")
    @JsonFormat(pattern = "HH:mm")
    LocalTime startTime;
    @Column(name = "end_time")
    @JsonFormat(pattern = "HH:mm")
    LocalTime endTime;
    @Column(name = "max_capacity")
    int maxCapacity;
    @OneToOne(cascade = CascadeType.MERGE, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id")
    AddressEntity centerAddress;
}
