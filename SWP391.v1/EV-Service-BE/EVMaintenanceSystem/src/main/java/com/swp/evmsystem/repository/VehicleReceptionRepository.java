package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.VehicleReceptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleReceptionRepository extends JpaRepository<VehicleReceptionEntity, Integer> {
    List<VehicleReceptionEntity> findByStatus(String status);

    List<VehicleReceptionEntity> findByCustomerPhone(String customerPhone);

    List<VehicleReceptionEntity> findByLicensePlate(String licensePlate);
    
    @Query("SELECT v FROM VehicleReceptionEntity v WHERE TRIM(UPPER(v.licensePlate)) = TRIM(UPPER(:licensePlate)) ORDER BY v.createdAt DESC")
    List<VehicleReceptionEntity> findByLicensePlateIgnoreCase(@Param("licensePlate") String licensePlate);

    List<VehicleReceptionEntity> findByAssignedTechnicianId(Integer technicianId);

    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<VehicleReceptionEntity> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT v FROM VehicleReceptionEntity v WHERE v.assignedTechnician.id = :technicianId")
    List<VehicleReceptionEntity> findByAssignedTechnician_Id(@Param("technicianId") Integer technicianId);
    
    @Query("SELECT COUNT(v) FROM VehicleReceptionEntity v WHERE v.assignedTechnician = :technician AND v.status NOT IN :statuses")
    long countByAssignedTechnicianAndStatusNotIn(@Param("technician") com.swp.evmsystem.entity.EmployeeEntity technician, @Param("statuses") List<String> statuses);
}
