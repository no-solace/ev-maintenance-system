package com.swp.evmsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.evmsystem.enums.OfferType;
import com.swp.evmsystem.enums.PartCategory;
import com.swp.evmsystem.enums.SparePartStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "phu_tung")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SparePartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spare_part_id")
    Integer sparePartId;

    @Column(name = "spare_part_name", length = 200, nullable = false)
    String sparePartName;

    @Column(name = "part_number", length = 100)
    String partNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    PartCategory category;

    @Column(name = "quantity", nullable = false)
    Integer quantity;

    @Column(name = "minimum_stock")
    Integer minimumStock;

    @Column(name = "price", nullable = false)
    Integer price;

    @Column(name = "unit_cost")
    Integer unitCost;

    @Column(name = "in_stock", nullable = false)
    Boolean inStock;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    SparePartStatus status = SparePartStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "center_id")
    @JsonIgnore
    ServiceCenterEntity center;

    @Column(name = "supplier", length = 200)
    String supplier;

    @Column(name = "description", length = 500)
    String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_type", length = 50, nullable = false)
    OfferType offerType = OfferType.REPLACEMENT;
    
    // Relationship with reception spare part requests
    @OneToMany(mappedBy = "sparePart")
    @JsonIgnore
    java.util.List<ReceptionSparePartEntity> receptionUsages;
}
