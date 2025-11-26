package com.swp.evmsystem.service;

import com.swp.evmsystem.model.DistrictEntity;
import com.swp.evmsystem.model.WardEntity;

public interface WardService {
    void createWard(WardEntity wardEntity);

    WardEntity findWardEntityByWardNameAndDistrict(String wardName, DistrictEntity district);
}
