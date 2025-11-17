package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.DistrictEntity;
import com.swp.evmsystem.entity.WardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends JpaRepository<WardEntity, Integer> {
    WardEntity findWardEntitiesByWardNameAndDistrictDistrictName(String wardName, String districtDistrictName);

    WardEntity findWardEntitiesByWardNameAndDistrict(String wardName, DistrictEntity district);
}
