package com.swp.evmsystem.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tinh_thanh")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class ProvinceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "province_id")
    Integer provinceId;
    @Column(name = "province_name", unique = true, length = 50, nullable = false)
    String provinceName;

    @Override
    public String toString() {
        return  provinceName;
    }
}