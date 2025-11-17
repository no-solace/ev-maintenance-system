package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.MaintenancePackageEntity;
import com.swp.evmsystem.repository.MaintenancePackageRepository;
import com.swp.evmsystem.service.MaintenancePackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenancePackageServiceImpl implements MaintenancePackageService {
    
    @Autowired
    private MaintenancePackageRepository maintenancePackageRepository;
    
    @Override
    public MaintenancePackageEntity createPackage(MaintenancePackageEntity packageEntity) {
        return maintenancePackageRepository.save(packageEntity);
    }
    
    @Override
    public List<MaintenancePackageEntity> getAllPackages() {
        return maintenancePackageRepository.findAll();
    }
    
    @Override
    public List<MaintenancePackageEntity> getPackagesByOfferType(Integer offerTypeId) {
        return maintenancePackageRepository.findByOfferType_OfferTypeId(offerTypeId);
    }
}
