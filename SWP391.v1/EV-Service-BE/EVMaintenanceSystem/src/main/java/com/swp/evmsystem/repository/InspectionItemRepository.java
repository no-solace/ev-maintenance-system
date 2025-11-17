package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.InspectionItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionItemRepository extends JpaRepository<InspectionItemEntity, Integer> {
    List<InspectionItemEntity> findByInspection_InspectionId(Integer inspectionId);
}
