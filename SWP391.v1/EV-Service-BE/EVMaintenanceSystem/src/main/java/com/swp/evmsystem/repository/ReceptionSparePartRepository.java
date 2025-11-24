package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.ReceptionSparePartEntity;
import com.swp.evmsystem.enums.SparePartRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceptionSparePartRepository extends JpaRepository<ReceptionSparePartEntity, Integer> {
    
    List<ReceptionSparePartEntity> findByReception_ReceptionId(Integer receptionId);
    
    List<ReceptionSparePartEntity> findByReception_ReceptionIdAndStatus(Integer receptionId, SparePartRequestStatus status);
    
    List<ReceptionSparePartEntity> findBySparePart_SparePartId(Integer sparePartId);
}
