package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.ProvinceEntity;
import com.swp.evmsystem.repository.ProvinceRepository;
import com.swp.evmsystem.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProvinceServiceImpl implements ProvinceService {
    @Autowired
    ProvinceRepository provinceEntityRepository;

    @Override
    public void createProvince(ProvinceEntity provinceEntity) {
        provinceEntityRepository.save(provinceEntity);
    }
}
