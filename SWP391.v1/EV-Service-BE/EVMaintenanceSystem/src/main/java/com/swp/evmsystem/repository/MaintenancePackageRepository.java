package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.MaintenancePackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swp.evmsystem.enums.OfferType;

import java.util.List;

@Repository
public interface MaintenancePackageRepository extends JpaRepository<MaintenancePackageEntity, Integer> {
    List<MaintenancePackageEntity> findByOfferType(OfferType offerType);
}
