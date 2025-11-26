package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.AdminDashboardStatsDTO;
import com.swp.evmsystem.dto.response.ApiResponse;
import com.swp.evmsystem.service.AdminDashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminDashboardController {
    
    final AdminDashboardService adminDashboardService;
    
    @GetMapping("/stats")
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
}
