package com.swp.evmsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.evmsystem.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "khach_hang")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@SuperBuilder
public class CustomerEntity extends UserEntity {
    @Column(name = "full_name", length = 100)
    String fullName;
    @Column(name = "gender", length = 10)
    @Enumerated(EnumType.STRING)
    Gender gender;
    @Column(name = "dob")
    LocalDate dob;
    @JsonIgnore
    @OneToMany(mappedBy = "owner" , fetch = FetchType.LAZY)
    List<ElectricVehicleEntity> vehicles = new ArrayList<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    AddressEntity address;

    public void addVehicle(ElectricVehicleEntity ev) {
        this.vehicles.add(ev);
        ev.setOwner(this);
    }
}
