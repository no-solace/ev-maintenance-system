package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;
import com.swp.evmsystem.dto.response.AdminAnalyticsTimeRangeDTO;
import com.swp.evmsystem.dto.response.AdminDashboardStatsDTO;
import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.service.AdminAnalyticsService;
import com.swp.evmsystem.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    final private AdminAnalyticsService analyticsService;
    final private AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDTO>> getDashboardStats() {
        log.info("📊 Admin dashboard stats requested");

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

    @GetMapping
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

    @GetMapping("/time-range")
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
}
