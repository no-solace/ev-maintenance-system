package com.swp.evmsystem.model;

import com.swp.evmsystem.enums.KmInterval;
import com.swp.evmsystem.enums.OfferType;
import com.swp.evmsystem.enums.PackageLevel;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Entity
@Table(
    name = "goi_bao_duong",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_package_offer_level",
            columnNames = {"offer_type", "level"}
        )
    }
)
@Builder
public class MaintenancePackageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    Integer packageId;

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_type", length = 50, nullable = false)
    OfferType offerType = OfferType.MAINTENANCE;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", length = 50, nullable = false, unique = true)
    PackageLevel level;

    @Column(name = "package_name", length = 100, nullable = false)
    String packageName;

    @Column(name = "price", nullable = false)
    Integer price;

    @Column(name = "duration_minutes", nullable = false)
    Integer durationMinutes;

    @Column(name = "description", length = 500)
    String description;

    public KmInterval getApplicableKmInterval() {
        if (level == null) {
            return null;
        }
        
        return switch (level) {
            case LEVEL_1 -> KmInterval.ONE_THOUSAND;
            case LEVEL_2 -> KmInterval.FIVE_THOUSAND;
            case LEVEL_3 -> KmInterval.TEN_THOUSAND;
        };
    }
}
