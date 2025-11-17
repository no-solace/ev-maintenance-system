package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.PaymentEntity;
import com.swp.evmsystem.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {

    // Find by invoice number
    Optional<PaymentEntity> findByInvoiceNumber(String invoiceNumber);

    // Find by status
    List<PaymentEntity> findByPaymentStatus(PaymentStatus status);

    // Find by customer phone
    List<PaymentEntity> findByCustomerPhone(String customerPhone);

    // Find by license plate
    List<PaymentEntity> findByLicensePlate(String licensePlate);

    // Find by reception ID
    Optional<PaymentEntity> findByReception_ReceptionId(Integer receptionId);
    
    // Find by booking ID (for deposit payments)
    Optional<PaymentEntity> findByBooking_BookingId(Integer bookingId);

    // Search by customer name, phone, or license plate
    @Query("""
                SELECT p FROM PaymentEntity p
                WHERE LOWER(p.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
                   OR LOWER(p.customerPhone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
                   OR LOWER(p.licensePlate) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
                   OR LOWER(p.invoiceNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
                ORDER BY p.createdAt DESC
            """)
    List<PaymentEntity> searchPayments(@Param("searchTerm") String searchTerm);

    // Find payments within date range
    @Query("""
                SELECT p FROM PaymentEntity p
                WHERE p.serviceDate BETWEEN :startDate AND :endDate
                ORDER BY p.serviceDate DESC
            """)
    List<PaymentEntity> findByServiceDateBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Count by status
    long countByPaymentStatus(PaymentStatus status);

    // Sum amounts by status
    @Query("SELECT COALESCE(SUM(p.finalAmount), 0.0) FROM PaymentEntity p WHERE p.paymentStatus = :status")
    Double sumAmountByStatus(@Param("status") PaymentStatus status);

    // Total revenue (all payments)
    @Query("SELECT COALESCE(SUM(p.finalAmount), 0.0) FROM PaymentEntity p")
    Double calculateTotalRevenue();

    // Find all payments ordered by creation date
    List<PaymentEntity> findAllByOrderByCreatedAtDesc();

    // Find payments by status and date range
    @Query("""
                SELECT p FROM PaymentEntity p
                WHERE p.paymentStatus = :status
                  AND p.createdAt BETWEEN :startDate AND :endDate
                ORDER BY p.createdAt DESC
            """)
    List<PaymentEntity> findByStatusAndDateRange(
            @Param("status") PaymentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
