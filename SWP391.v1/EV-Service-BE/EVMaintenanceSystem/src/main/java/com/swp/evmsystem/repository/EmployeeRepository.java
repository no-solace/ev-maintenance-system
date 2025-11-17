package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.entity.ServiceCenterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Integer> {

    List<EmployeeEntity> findByCenterId(ServiceCenterEntity centerId);

    @Query("SELECT e FROM EmployeeEntity e WHERE e.role = 'TECHNICIAN'")
    List<EmployeeEntity> findAllTechnicians();
    
    @Query("SELECT e FROM EmployeeEntity e WHERE e.role = 'TECHNICIAN' AND e.center.id = :centerId")
    List<EmployeeEntity> findTechniciansByCenterId(Integer centerId);
}
