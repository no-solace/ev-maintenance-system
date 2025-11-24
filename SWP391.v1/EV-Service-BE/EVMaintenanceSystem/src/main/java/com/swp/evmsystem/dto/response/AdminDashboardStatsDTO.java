package com.swp.evmsystem.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminDashboardStatsDTO {
    // Monthly Revenue: Tổng doanh thu từ tất cả 5 trung tâm
    Long monthlyRevenue;
    Double revenueChangePercent; // % thay đổi so với tháng trước
    
    // Total Customers: Tổng khách hàng đã phục vụ (unique customers)
    Long totalCustomers;
    Double customerChangePercent; // % thay đổi so với tháng trước
    
    // Service Efficiency: % dịch vụ hoàn thành đúng hạn / tổng dịch vụ
    Double serviceEfficiency; // 0-100%
    Double efficiencyChangePercent; // % thay đổi so với tháng trước
    
    // Staff Utilization: % giờ làm việc thực tế / tổng giờ có thể làm việc
    Double staffUtilization; // 0-100%
    Double utilizationChangePercent; // % thay đổi so với tháng trước
    
    // Additional stats
    Long totalBookingsThisMonth;
    Long completedBookingsThisMonth;
    Long activeStaff;
    Long activeTechnicians;
    
    // Service center stats
    Long totalServiceCenters;
    Long pendingPaymentBookings;
    
    // Service types distribution
    List<ServiceTypeDistribution> serviceDistribution;
    
    // Recent activities
    List<RecentActivity> recentActivities;
    
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
    public static class RecentActivity {
        String id;
        String type; // booking, payment, review, inventory, user
        String message;
        String time;
        LocalDateTime timestamp;
    }
}
