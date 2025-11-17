package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.CustomerEntity;
import com.swp.evmsystem.entity.ElectricVehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectricVehicleRepository extends JpaRepository<ElectricVehicleEntity, Integer> {
    List<ElectricVehicleEntity> findByOwner(CustomerEntity owner);

    Optional<ElectricVehicleEntity> findById(Integer vehicleId);

    Optional<ElectricVehicleEntity> findByLicensePlate(String licensePlate);
    
    Optional<ElectricVehicleEntity> findByVin(String vin);

    ElectricVehicleEntity save(ElectricVehicleEntity ev);

    boolean existsElectricVehicleEntityByIdAndOwner_Id(int id, int ownerId);

    boolean getElectricVehicleEntityById(int id);
}
