package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.InspectionRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRecordRepository extends JpaRepository<InspectionRecordEntity, Integer> {
    
    List<InspectionRecordEntity> findByVehicleReception_ReceptionId(Integer receptionId);
    
    List<InspectionRecordEntity> findByVehicleReception_ReceptionIdOrderByInspectionTask_Id(Integer receptionId);
}
