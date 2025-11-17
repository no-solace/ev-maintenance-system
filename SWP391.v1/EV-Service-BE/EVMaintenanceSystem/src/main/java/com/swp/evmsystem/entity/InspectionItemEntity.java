package com.swp.evmsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "inspection_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InspectionItemEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    Integer itemId;
    
    @ManyToOne
    @JoinColumn(name = "inspection_id", referencedColumnName = "inspection_id")
    InspectionEntity inspection;
    
    @ManyToOne
    @JoinColumn(name = "spare_part_id", referencedColumnName = "spare_part_id")
    SparePartEntity sparePart;
    
    @Column(name = "quantity")
    Integer quantity;
    
    @Column(name = "unit_price")
    Double unitPrice;
    
    @Column(name = "total_price")
    Double totalPrice;
    
    @Column(name = "issue_description", length = 500)
    String issueDescription;
    
    @Column(name = "is_critical")
    Boolean isCritical;
}
