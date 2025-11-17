package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.OfferTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferTypeRepository extends JpaRepository<OfferTypeEntity, Integer> {
    List<OfferTypeEntity> findAll();
}
