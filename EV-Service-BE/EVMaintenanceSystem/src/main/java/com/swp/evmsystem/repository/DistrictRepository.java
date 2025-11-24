package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.DistrictEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictRepository extends CrudRepository<DistrictEntity, Integer> {
    DistrictEntity save(DistrictEntity districtEntity);

    DistrictEntity findDistrictEntitiesByDistrictName(String districtName);
}
