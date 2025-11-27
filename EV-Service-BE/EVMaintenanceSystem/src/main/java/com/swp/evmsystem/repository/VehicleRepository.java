package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.CustomerEntity;
import com.swp.evmsystem.model.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, Integer> {
    List<VehicleEntity> findByOwnerId(Integer ownerId);

    Optional<VehicleEntity> findById(Integer vehicleId);

    Optional<VehicleEntity> findByLicensePlate(String licensePlate);

    Optional<VehicleEntity> findByVin(String vin);

    @Query("SELECT c FROM CustomerEntity c WHERE c.id = :vehicleId")
    CustomerEntity findOwnerById(@Param("vehicleId") Integer vehicleId);

    Boolean existsByIdAndOwnerId(Integer vehicleId, Integer ownerId);
}
