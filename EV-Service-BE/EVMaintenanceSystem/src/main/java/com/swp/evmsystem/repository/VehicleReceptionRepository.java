package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.EmployeeEntity;
import com.swp.evmsystem.model.VehicleReceptionEntity;
import com.swp.evmsystem.enums.ReceptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleReceptionRepository extends JpaRepository<VehicleReceptionEntity, Integer> {
    List<VehicleReceptionEntity> findByStatus(ReceptionStatus status);
    
    @Query("SELECT v FROM VehicleReceptionEntity v WHERE TRIM(UPPER(v.licensePlate)) = TRIM(UPPER(:licensePlate)) ORDER BY v.createdAt DESC")
    List<VehicleReceptionEntity> findByLicensePlate(@Param("licensePlate") String licensePlate);
    
    @Query("SELECT v FROM VehicleReceptionEntity v WHERE v.assignedTechnician.id = :technicianId ORDER BY v.createdAt DESC")
    List<VehicleReceptionEntity> findByAssignedTechnicianId(@Param("technicianId") Integer technicianId);

    Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Long countByCreatedAtBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, ReceptionStatus status);
    
    List<VehicleReceptionEntity> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT v FROM VehicleReceptionEntity v WHERE v.assignedTechnician.id = :technicianId")
    List<VehicleReceptionEntity> findByAssignedTechnician_Id(@Param("technicianId") Integer technicianId);
    
    @Query("SELECT COUNT(v) FROM VehicleReceptionEntity v WHERE v.assignedTechnician = :technician AND v.status NOT IN :statuses")
    long countByAssignedTechnicianAndStatusNotIn(@Param("technician") EmployeeEntity technician, @Param("statuses") List<ReceptionStatus> statuses);
    
    // Find walk-in receptions (no booking) by center, ordered by FIFO (createdAt)
    @Query("SELECT v FROM VehicleReceptionEntity v WHERE v.booking IS NULL AND v.assignedTechnician.center.id = :centerId AND v.status IN :statuses ORDER BY v.createdAt ASC")
    List<VehicleReceptionEntity> findWalkinReceptionsByCenterAndStatus(@Param("centerId") Integer centerId, @Param("statuses") ReceptionStatus statuses);

    List<VehicleReceptionEntity> findAllByCenter_Id(Integer centerId);
    
    // Find receptions by customer's vehicle license plates
    @Query("SELECT v FROM VehicleReceptionEntity v WHERE " +
           "v.licensePlate IN (SELECT ev.licensePlate FROM ElectricVehicleEntity ev WHERE ev.owner.id = :customerId) " +
           "ORDER BY v.createdAt DESC")
    List<VehicleReceptionEntity> findByCustomerId(@Param("customerId") Integer customerId);
}
