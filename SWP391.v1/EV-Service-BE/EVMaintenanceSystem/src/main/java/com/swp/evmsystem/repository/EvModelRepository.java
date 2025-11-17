package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.EvModelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvModelRepository extends JpaRepository<EvModelEntity, Integer> {
    EvModelEntity save(EvModelEntity entity);
}
