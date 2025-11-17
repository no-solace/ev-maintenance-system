package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.InspectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InspectionRepository extends JpaRepository<InspectionEntity, Integer> {
    Optional<InspectionEntity> findByBooking_BookingId(Integer bookingId);

    Optional<InspectionEntity> findByReception_ReceptionId(Integer receptionId);

    List<InspectionEntity> findByTechnician_Id(Integer technicianId);
}
