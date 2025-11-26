package com.swp.evmsystem.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "quan_thanh")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class DistrictEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "district_id")
    Integer districtId;
    @Column(name = "district_name", length = 50, nullable = false)
    String districtName;
    @JoinColumn(name = "province_id")
    @ManyToOne(fetch = FetchType.LAZY)
    ProvinceEntity province;

    @Override
    public String toString() {
        return  districtName + ", " + province.toString();
    }
}
