package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.EmployeeEntity;
import com.swp.evmsystem.model.ReceptionEntity;
import com.swp.evmsystem.enums.ReceptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReceptionRepository extends JpaRepository<ReceptionEntity, Integer> {
    List<ReceptionEntity> findByStatus(ReceptionStatus status);
    
    @Query("SELECT v FROM ReceptionEntity v WHERE TRIM(UPPER(v.licensePlate)) = TRIM(UPPER(:licensePlate)) ORDER BY v.createdAt DESC")
    List<ReceptionEntity> findByLicensePlate(@Param("licensePlate") String licensePlate);
    
    @Query("SELECT v FROM ReceptionEntity v WHERE v.assignedTechnician.id = :technicianId ORDER BY v.createdAt DESC")
    List<ReceptionEntity> findByAssignedTechnicianId(@Param("technicianId") Integer technicianId);

    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Long countByCreatedAtBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, ReceptionStatus status);
    
    List<ReceptionEntity> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT v FROM ReceptionEntity v WHERE v.assignedTechnician.id = :technicianId")
    List<ReceptionEntity> findByAssignedTechnician_Id(@Param("technicianId") Integer technicianId);
    
    @Query("SELECT COUNT(v) FROM ReceptionEntity v WHERE v.assignedTechnician = :technician AND v.status NOT IN :statuses")
    long countByAssignedTechnicianAndStatusNotIn(@Param("technician") EmployeeEntity technician, @Param("statuses") List<ReceptionStatus> statuses);
    
    // Find walk-in receptions (no booking) by center, ordered by FIFO (createdAt)
    @Query("SELECT v FROM ReceptionEntity v WHERE v.booking IS NULL AND v.assignedTechnician.center.id = :centerId AND v.status IN :statuses ORDER BY v.createdAt ASC")
    List<ReceptionEntity> findWalkinReceptionsByCenterAndStatus(@Param("centerId") Integer centerId, @Param("statuses") ReceptionStatus statuses);

    List<ReceptionEntity> findAllByCenter_Id(Integer centerId);
    
    // Find receptions by customer's vehicle license plates
    @Query("SELECT v FROM ReceptionEntity v WHERE " +
           "v.licensePlate IN (SELECT ev.licensePlate FROM VehicleEntity ev WHERE ev.owner.id = :customerId) " +
           "ORDER BY v.createdAt DESC")
    List<ReceptionEntity> findByCustomerId(@Param("customerId") Integer customerId);
}
