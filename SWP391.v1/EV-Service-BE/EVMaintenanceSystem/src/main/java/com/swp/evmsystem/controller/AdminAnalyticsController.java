package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;
import com.swp.evmsystem.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {
    
    @Autowired
    private AdminAnalyticsService analyticsService;

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
}
