package com.swp.evmsystem.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminAnalyticsTimeRangeDTO {
    
    // Overview Statistics
    OverviewStats overview;
    
    // Revenue and Service Trends (time series data)
    List<TrendDataPoint> revenueTrends;
    List<TrendDataPoint> serviceTrends;
    
    // Service Performance Metrics
    ServicePerformance servicePerformance;
    
    // Service Type Distribution
    List<ServiceTypeDistribution> serviceTypeDistribution;
    
    // Customer Insights
    CustomerInsights customerInsights;
    
    // Top Performing Services
    List<TopPerformingService> topPerformingServices;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OverviewStats {
        // Total Revenue in period
        Long totalRevenue;
        Double revenueChangePercent; // vs previous period
        
        // Total Services completed
        Long totalServices;
        Double servicesChangePercent;
        
        // Active unique customers
        Long activeCustomers;
        Double customersChangePercent;
        
        // Average service value
        Long avgServiceValue;
        Double avgValueChangePercent;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TrendDataPoint {
        String period; // "Apr", "May", "Week 1", "Jan 2024"
        Long value; // Revenue amount or service count
        String label; // Display label
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ServicePerformance {
        // Completion Rate: % services completed
        Double completionRate;
        
        // Average jobs per customer
        Double avgJobsPerCustomer;
        
        // Customer satisfaction (out of 5.0)
        Double customerSatisfaction;
        
        // On-time completion percentage
        Double onTimeCompletion;
        
        // First-time fix rate
        Double firstTimeFixRate;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ServiceTypeDistribution {
        String name;
        Long count;
        Double percentage;
        String color;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CustomerInsights {
        Long totalCustomers;
        Long repeatCustomers;
        Double retentionRate;
        Long newCustomers30Days;
        Double avgServicePerCustomer;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TopPerformingService {
        String name;
        Long revenue;
        Long count;
    }
}
