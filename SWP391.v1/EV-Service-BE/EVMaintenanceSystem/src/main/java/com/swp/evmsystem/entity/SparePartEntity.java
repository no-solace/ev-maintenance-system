package com.swp.evmsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.evmsystem.enums.PartCategory;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

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
    
    @Column(name = "part_number", length = 100, unique = true)
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

    @ManyToOne
    @JoinColumn(name = "center_id")
    @JsonIgnore
    ServiceCenterEntity center;
    
    @Column(name = "supplier", length = 200)
    String supplier;
    
    @Column(name = "description", length = 500)
    String description;
    
    @ManyToMany
    @JoinTable(
            name = "spare_part_model",
            joinColumns = @JoinColumn(name = "spare_part_id"),
            inverseJoinColumns = @JoinColumn(name = "model_id")
    )
    @JsonIgnore
    List<EvModelEntity> compatibleModels;
}
