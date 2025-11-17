package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.DistrictEntity;
import com.swp.evmsystem.repository.DistrictRepository;
import com.swp.evmsystem.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DistrictServiceImpl implements DistrictService {
    @Autowired
    DistrictRepository districtEntityRepository;


    @Override
    public void createDistrict(DistrictEntity districtEntity) {
        districtEntityRepository.save(districtEntity);
    }

}
