package com.swp.evmsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "loai_dich_vu")
@Builder
public class OfferTypeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    int offerTypeId;
    @Column(name = "offer_name",length = 100)
    String offerTypeName;
    @Column(name = "offer_description",length = 100)
    String offerTypeDescription;
}
