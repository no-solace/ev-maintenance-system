package com.swp.evmsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "dia_chi")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class AddressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    Integer address_id;
    @Column(name = "address_line", nullable = false)
    String addressLine;
    @JoinColumn(name = "ward_id")
    @ManyToOne(fetch = FetchType.LAZY)
    WardEntity ward;
    @Override
    public String toString() {
        return addressLine + ", " + ward.toString();
    }
}
