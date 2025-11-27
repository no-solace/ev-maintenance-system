package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;
import com.swp.evmsystem.dto.response.AdminAnalyticsTimeRangeDTO;
import com.swp.evmsystem.dto.response.AdminDashboardStatsDTO;
import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.service.AdminAnalyticsService;
import com.swp.evmsystem.service.AdminDashboardService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class AdminController {
    @PersistenceContext
    EntityManager entityManager;
    final AdminDashboardService adminDashboardService;
    final AdminAnalyticsService analyticsService;

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsDTO> getAnalytics(
            @RequestParam(defaultValue = "MONTH") String periodType,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer period) {

        if (year == null) {
            year = LocalDate.now().getYear();
        }

        if (period == null) {
            if ("MONTH".equalsIgnoreCase(periodType)) {
                period = LocalDate.now().getMonthValue();
            } else if ("QUARTER".equalsIgnoreCase(periodType)) {
                period = (LocalDate.now().getMonthValue() - 1) / 3 + 1;
            }
        }

        AdminAnalyticsDTO analytics = analyticsService.getAnalytics(periodType, year, period);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/time-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminAnalyticsTimeRangeDTO>> getAnalyticsByTimeRange(
            @RequestParam(defaultValue = "6MONTHS") String range) {

        try {
            AdminAnalyticsTimeRangeDTO analytics = analyticsService.getAnalyticsByTimeRange(range);

            return ResponseEntity.ok(
                    ApiResponse.<AdminAnalyticsTimeRangeDTO>builder()
                            .success(true)
                            .message("Analytics retrieved successfully")
                            .data(analytics)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<AdminAnalyticsTimeRangeDTO>builder()
                            .success(false)
                            .message("Failed to retrieve analytics: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDTO>> getDashboardStats() {
        try {
            AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();

            return ResponseEntity.ok(
                    ApiResponse.<AdminDashboardStatsDTO>builder()
                            .success(true)
                            .message("Dashboard statistics retrieved successfully")
                            .data(stats)
                            .build()
            );
        } catch (Exception e) {
            log.error("❌ Error retrieving admin dashboard stats", e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<AdminDashboardStatsDTO>builder()
                            .success(false)
                            .message("Failed to retrieve dashboard statistics: " + e.getMessage())
                            .build()
            );
        }
    }

    @PostMapping("/data-import/sample-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<ApiResponse<String>> importSampleBookings() {

        try {
            Random random = new Random();
            int currentId = 100; // Starting booking ID
            int totalInserted = 0;

            // Loop through 5 centers
            for (int centerLoop = 1; centerLoop <= 5; centerLoop++) {
                int centerId = centerLoop;

                // 10 bookings per service type per center
                for (int serviceLoop = 1; serviceLoop <= 10; serviceLoop++) {
                    int vehicleId = ((serviceLoop - 1) % 10) + 1;

                    // Random date in November 2025
                    LocalDate bookingDate = LocalDate.of(2025, 11, 1).plusDays(random.nextInt(30));

                    // Random time between 08:00 - 17:00
                    LocalTime bookingTime = LocalTime.of(8 + random.nextInt(10), 0);

                    String serviceName;
                    String serviceDescription;
                    long totalAmount;
                    String paymentMethod;
                    String vehicleModel;
                    String notes;

                    // Service Type 1: Maintenance Level 3 (2 bookings)
                    if (serviceLoop <= 2) {
                        serviceName = "Bảo dưỡng cấp 3";
                        serviceDescription = "Gói bảo dưỡng mỗi 10000km";
                        totalAmount = 300000;
                        paymentMethod = "VNPAY";
                        vehicleModel = "VinFast Evo 200";
                        notes = "Bảo dưỡng cấp 3 - 10000km";
                    }
                    // Service Type 2: Maintenance Level 2 (2 bookings)
                    else if (serviceLoop <= 4) {
                        serviceName = "Bảo dưỡng cấp 2";
                        serviceDescription = "Gói bảo dưỡng mỗi 5000km";
                        totalAmount = 250000;
                        paymentMethod = "VNPAY";
                        vehicleModel = "VinFast Theon S";
                        notes = "Bảo dưỡng cấp 2 - 5000km";
                    }
                    // Service Type 3: Battery Pack replacement (2 bookings)
                    else if (serviceLoop <= 6) {
                        serviceName = "Thay thế phụ tùng";
                        serviceDescription = "Battery Pack 48V 20Ah";
                        totalAmount = 3500000;
                        paymentMethod = "VNPAY";
                        vehicleModel = "VinFast Feliz S";
                        notes = "Thay thế Battery Pack 48V 20Ah";
                    }
                    // Service Type 4: Battery Management System (2 bookings)
                    else if (serviceLoop <= 8) {
                        serviceName = "Thay thế phụ tùng";
                        serviceDescription = "Battery Management System";
                        totalAmount = 1200000;
                        paymentMethod = "CASH";
                        vehicleModel = "VinFast Klara S";
                        notes = "Thay thế Battery Management System";
                    }
                    // Service Type 5: Battery Temperature Sensor (2 bookings)
                    else {
                        serviceName = "Thay thế phụ tùng";
                        serviceDescription = "Battery Temperature Sensor";
                        totalAmount = 180000;
                        paymentMethod = "CASH";
                        vehicleModel = "VinFast Ludo";
                        notes = "Thay thế Battery Temperature Sensor";
                    }

                    String customerName = "Khách hàng " + currentId;
                    String customerPhone = String.format("090%07d", currentId);
                    String customerEmail = "customer" + currentId + "@test.com";
                    String licensePlate = String.format("%dMD%05d", 49 + (serviceLoop % 5), currentId);
                    LocalDateTime paymentDate = LocalDateTime.of(bookingDate, bookingTime).plusHours(2);

                    // Insert booking
                    entityManager.createNativeQuery(
                                    "INSERT INTO lich_hen (customer_name, customer_phone, customer_email, vehicle_id, center_id, booking_date, booking_time, status, notes, created_at) " +
                                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                            )
                            .setParameter(1, customerName)
                            .setParameter(2, customerPhone)
                            .setParameter(3, customerEmail)
                            .setParameter(4, vehicleId)
                            .setParameter(5, centerId)
                            .setParameter(6, bookingDate)
                            .setParameter(7, bookingTime)
                            .setParameter(8, "COMPLETED")
                            .setParameter(9, notes)
                            .setParameter(10, LocalDateTime.now())
                            .executeUpdate();

                    // Insert payment
                    String invoiceNumber = String.format("INV%06d", currentId);
                    entityManager.createNativeQuery(
                                    "INSERT INTO thanh_toan (booking_id, invoice_number, customer_name, customer_phone, customer_email, " +
                                            "vehicle_info, license_plate, service_name, service_description, " +
                                            "total_amount, discount_amount, final_amount, payment_status, payment_method, payment_date, created_at, updated_at) " +
                                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                            )
                            .setParameter(1, currentId)
                            .setParameter(2, invoiceNumber)
                            .setParameter(3, customerName)
                            .setParameter(4, customerPhone)
                            .setParameter(5, customerEmail)
                            .setParameter(6, vehicleModel)
                            .setParameter(7, licensePlate)
                            .setParameter(8, serviceName)
                            .setParameter(9, serviceDescription)
                            .setParameter(10, (double) totalAmount)
                            .setParameter(11, 0.0)
                            .setParameter(12, (double) totalAmount)
                            .setParameter(13, "COMPLETED")
                            .setParameter(14, paymentMethod)
                            .setParameter(15, paymentDate)
                            .setParameter(16, LocalDateTime.now())
                            .setParameter(17, LocalDateTime.now())
                            .executeUpdate();

                    currentId++;
                    totalInserted++;
                }
            }

            log.info("✅ Successfully imported {} sample bookings and payments", totalInserted);

            return ResponseEntity.ok(
                    ApiResponse.<String>builder()
                            .success(true)
                            .message("Successfully imported " + totalInserted + " sample bookings")
                            .data(String.valueOf(totalInserted))
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.<String>builder()
                            .success(false)
                            .message("Failed to import sample data: " + e.getMessage())
                            .build()
            );
        }
    }
}
