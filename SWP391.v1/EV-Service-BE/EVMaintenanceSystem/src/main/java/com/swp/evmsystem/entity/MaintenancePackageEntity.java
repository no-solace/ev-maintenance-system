package com.swp.evmsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@Table(name = "goi_bao_duong")
@Builder
public class MaintenancePackageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    Integer packageId;
    
    @Column(name = "package_name", length = 100, nullable = false)
    String packageName;
    
    @Column(name = "price", nullable = false)
    Integer price;
    
    @Column(name = "duration_minutes", nullable = false)
    Integer durationMinutes;
    
    @Column(name = "description", length = 500)
    String description;
    
    @Column(name = "includes", length = 1000)
    String includes; // Store as JSON string or comma-separated
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_type_id")
    @JsonIgnore
    OfferTypeEntity offerType;
}
