package com.swp.evmsystem.service;

import com.swp.evmsystem.entity.DistrictEntity;
import com.swp.evmsystem.entity.WardEntity;

public interface WardService {
    void createWard(WardEntity wardEntity);

    WardEntity findWardEntityByWardNameAndDistrict(String wardName, DistrictEntity district);
}
