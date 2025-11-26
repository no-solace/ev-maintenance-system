package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.BookingEntity;
import com.swp.evmsystem.model.ServiceCenterEntity;
import com.swp.evmsystem.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Integer> {
    BookingEntity save(BookingEntity bookingEntity);

    @Query(value = """
                SELECT COUNT(*)
                FROM lich_hen
                WHERE center_id = :centerId
                  AND booking_date = :date
                  AND CAST(booking_time AS TIME) = CAST(:time AS TIME)
                  AND status != 'CANCELLED'
            """, nativeQuery = true)
    long countBookingsAtTime(
            @Param("centerId") Integer centerId,
            @Param("date") LocalDate date,
            @Param("time") LocalTime time
    );

    List<BookingEntity> findByCenter_Id(Integer centerId);


    interface BookingCountProjection {
        LocalTime getTime();

        Integer getCount();
    }

    @Query("""
                SELECT b.bookingTime AS time, COUNT(b.bookingId) AS count
                FROM BookingEntity b
                WHERE b.center = :center AND b.bookingDate = :date
                  AND b.status != com.swp.evmsystem.enums.BookingStatus.CANCELLED
                GROUP BY b.bookingTime
            """)
    List<BookingCountProjection> findByCenterAndBookingDate(
            @Param("center") ServiceCenterEntity center,
            @Param("date") LocalDate date
    );

    // New queries for staff workflow
    List<BookingEntity> findByStatus(BookingStatus status);

    List<BookingEntity> findByVehicle_Id(Integer vehicleId);

    List<BookingEntity> findByVehicle_OwnerId(Integer customerId);

    // Count methods for statistics
    long countByStatus(BookingStatus status);

    // Analytics queries
    @Query("SELECT COUNT(b) FROM BookingEntity b WHERE b.bookingDate >= :startDate AND b.bookingDate <= :endDate")
    Long countByBookingTimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM BookingEntity b WHERE b.bookingDate >= :startDate AND b.bookingDate <= :endDate ORDER BY b.bookingDate DESC")
    List<BookingEntity> findByBookingTimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find bookings by center ID and date (for booking slots display)
    @Query("SELECT b FROM BookingEntity b WHERE b.center.id = :centerId AND b.bookingDate = :date AND b.status = com.swp.evmsystem.enums.BookingStatus.UPCOMING ORDER BY b.bookingTime ASC")
    List<BookingEntity> findByCenterIdAndBookingDate(@Param("centerId") Integer centerId, @Param("date") LocalDate date);
}
