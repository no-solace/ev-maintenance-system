package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.DistrictEntity;
import com.swp.evmsystem.entity.WardEntity;
import com.swp.evmsystem.repository.WardRepository;
import com.swp.evmsystem.service.WardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WardServiceImpl implements WardService {
    @Autowired
    private WardRepository wardEntityRepository;

    @Override
    public void createWard(WardEntity wardEntity) {
        wardEntityRepository.save(wardEntity);
    }

    @Override
    public WardEntity findWardEntityByWardNameAndDistrict(String wardName, DistrictEntity district) {
        return wardEntityRepository.findWardEntitiesByWardNameAndDistrict(wardName, district);
    }
}
