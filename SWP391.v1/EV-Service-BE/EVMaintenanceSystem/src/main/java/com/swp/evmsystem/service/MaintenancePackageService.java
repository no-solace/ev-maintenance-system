package com.swp.evmsystem.service;

import com.swp.evmsystem.entity.MaintenancePackageEntity;

import java.util.List;

public interface MaintenancePackageService {
    MaintenancePackageEntity createPackage(MaintenancePackageEntity packageEntity);
    List<MaintenancePackageEntity> getAllPackages();
    List<MaintenancePackageEntity> getPackagesByOfferType(Integer offerTypeId);
}
