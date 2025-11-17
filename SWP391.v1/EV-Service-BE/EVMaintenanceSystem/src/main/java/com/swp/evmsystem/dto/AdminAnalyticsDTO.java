package com.swp.evmsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDTO {
    
    // Overview Statistics
    private OverviewStats overview;
    
    // Revenue by period
    private List<PeriodRevenue> revenueByPeriod;
    
    // Booking statistics
    private BookingAnalytics bookingAnalytics;
    
    // Employee performance
    private List<EmployeePerformance> employeePerformance;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverviewStats {
        private Double totalRevenue;
        private Long totalBookings;
        private Long totalReceptions;
        private Long totalPayments;
        private Long activeEmployees;
        private Double averageRevenuePerBooking;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodRevenue {
        private String period; // "2024-Q1", "2024-01", "2024"
        private Double revenue;
        private Long bookingCount;
        private Long receptionCount;
        private Double averageRevenue;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingAnalytics {
        private Long totalBookings;
        private Long confirmedBookings;
        private Long completedBookings;
        private Long cancelledBookings;
        private Double completionRate;
        private Double cancellationRate;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeePerformance {
        private Integer employeeId;
        private String employeeName;
        private String role; // TECHNICIAN, STAFF
        private Long tasksCompleted;
        private Double revenueGenerated;
        private Double averageRating;
        private Long totalWorkHours;
        private Double efficiency; // tasks/hour
    }
}
