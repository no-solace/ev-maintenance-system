package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.ProvinceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinceRepository extends JpaRepository<ProvinceEntity, Integer> {
    ProvinceEntity save(ProvinceEntity provinceEntity);
}
