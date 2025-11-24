package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.SparePartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SparePartRepository extends JpaRepository<SparePartEntity, Integer> {
    List<SparePartEntity> findByInStock(Boolean inStock);
}
