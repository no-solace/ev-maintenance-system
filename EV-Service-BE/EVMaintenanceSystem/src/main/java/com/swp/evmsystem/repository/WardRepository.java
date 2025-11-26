package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.DistrictEntity;
import com.swp.evmsystem.model.WardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends JpaRepository<WardEntity, Integer> {

    WardEntity findWardEntitiesByWardNameAndDistrict(String wardName, DistrictEntity district);
}
