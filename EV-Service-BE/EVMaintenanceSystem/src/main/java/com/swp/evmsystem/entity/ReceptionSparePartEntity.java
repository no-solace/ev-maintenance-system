package com.swp.evmsystem.entity;

import com.swp.evmsystem.enums.SparePartRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "phu_tung_su_dung")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ReceptionSparePartEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Integer id;
    
    @ManyToOne
    @JoinColumn(name = "reception_id", nullable = false)
    VehicleReceptionEntity reception;
    
    @ManyToOne
    @JoinColumn(name = "spare_part_id", nullable = false)
    SparePartEntity sparePart;
    
    // Thuộc tính bổ sung
    @Column(name = "quantity")
    Integer quantity;
    
    @Column(name = "unit_price")
    Double unitPrice;
    
    @Column(name = "notes", length = 500)
    String notes;
    
    @Column(name = "requested_at")
    LocalDateTime requestedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    SparePartRequestStatus status;
    
    @Column(name = "is_critical")
    Boolean isCritical;
    
    @Column(name = "issue_description", length = 1000)
    String issueDescription;

    // Calculated field - not stored in DB
    @Transient
    public Double getTotalPrice() {
        if (quantity != null && unitPrice != null) {
            return quantity * unitPrice;
        }
        return 0.0;
    }
}
