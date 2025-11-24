package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.ServiceCenterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CenterRepository extends JpaRepository<ServiceCenterEntity, Integer> {
    Optional<ServiceCenterEntity> findById(int id);

    ServiceCenterEntity save(ServiceCenterEntity ev);
}
