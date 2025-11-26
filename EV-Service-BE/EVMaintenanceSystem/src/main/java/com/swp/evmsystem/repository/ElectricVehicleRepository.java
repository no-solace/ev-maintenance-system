package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.CustomerEntity;
import com.swp.evmsystem.model.ElectricVehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectricVehicleRepository extends JpaRepository<ElectricVehicleEntity, Integer> {
    List<ElectricVehicleEntity> findByOwnerId(Integer ownerId);

    Optional<ElectricVehicleEntity> findById(Integer vehicleId);

    Optional<ElectricVehicleEntity> findByLicensePlate(String licensePlate);

    Optional<ElectricVehicleEntity> findByVin(String vin);

    @Query("SELECT c FROM CustomerEntity c WHERE c.id = :vehicleId")
    CustomerEntity findOwnerById(@Param("vehicleId") Integer vehicleId);

    Boolean existsByIdAndOwnerId(Integer vehicleId, Integer ownerId);
}
