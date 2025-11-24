package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.MaintenancePackageEntity;
import com.swp.evmsystem.repository.MaintenancePackageRepository;
import com.swp.evmsystem.service.MaintenancePackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenancePackageServiceImpl implements MaintenancePackageService {

    final private MaintenancePackageRepository maintenancePackageRepository;

    @Override
    public List<MaintenancePackageEntity> getPackages() {
        return maintenancePackageRepository.findAll();
    }
}