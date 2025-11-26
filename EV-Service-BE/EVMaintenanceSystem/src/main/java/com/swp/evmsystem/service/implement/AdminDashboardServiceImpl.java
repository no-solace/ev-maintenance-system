package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.AdminDashboardStatsDTO;
import com.swp.evmsystem.model.BookingEntity;
import com.swp.evmsystem.model.EmployeeEntity;
import com.swp.evmsystem.model.PaymentEntity;
import com.swp.evmsystem.model.ServiceCenterEntity;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.enums.PaymentStatus;
import com.swp.evmsystem.enums.Role;
import com.swp.evmsystem.enums.UserStatus;
import com.swp.evmsystem.repository.BookingRepository;
import com.swp.evmsystem.repository.CenterRepository;
import com.swp.evmsystem.repository.PaymentRepository;
import com.swp.evmsystem.repository.UserRepository;
import com.swp.evmsystem.repository.VehicleReceptionRepository;
import com.swp.evmsystem.service.AdminDashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminDashboardServiceImpl implements AdminDashboardService {
    
    BookingRepository bookingRepository;
    UserRepository userRepository;
    PaymentRepository paymentRepository;
    CenterRepository centerRepository;
    VehicleReceptionRepository receptionRepository;
    
    @Override
    public AdminDashboardStatsDTO getDashboardStats() {
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);
        YearMonth lastMonth = currentMonth.minusMonths(1);
        
        // 1. Monthly Revenue - Tổng doanh thu tháng này
        Long monthlyRevenue = calculateMonthlyRevenue(currentMonth);
        Long lastMonthRevenue = calculateMonthlyRevenue(lastMonth);
        Double revenueChangePercent = calculateChangePercent(monthlyRevenue, lastMonthRevenue);
        
        // 2. Total Customers - Tổng khách hàng unique đã phục vụ
        Long totalCustomers = countUniqueCustomers(currentMonth);
        Long lastMonthCustomers = countUniqueCustomers(lastMonth);
        Double customerChangePercent = calculateChangePercent(totalCustomers, lastMonthCustomers);
        
        // 3. Service Efficiency - % hoàn thành đúng hạn
        Double serviceEfficiency = calculateServiceEfficiency(currentMonth);
        Double lastMonthEfficiency = calculateServiceEfficiency(lastMonth);
        Double efficiencyChangePercent = calculateChangePercent(
            serviceEfficiency.longValue(), 
            lastMonthEfficiency.longValue()
        );
        
        // 4. Staff Utilization - % sử dụng nhân viên
        Double staffUtilization = calculateStaffUtilization(currentMonth);
        Double lastMonthUtilization = calculateStaffUtilization(lastMonth);
        Double utilizationChangePercent = calculateChangePercent(
            staffUtilization.longValue(), 
            lastMonthUtilization.longValue()
        );
        
        // Additional stats
        Long totalBookingsThisMonth = countBookingsInMonth(currentMonth);
        Long completedBookingsThisMonth = countCompletedBookingsInMonth(currentMonth);
        Long activeStaff = countActiveEmployeesByRole(Role.STAFF);
        Long activeTechnicians = countActiveEmployeesByRole(Role.TECHNICIAN);
        Long totalServiceCenters = centerRepository.count();
        Long pendingPaymentBookings = bookingRepository.countByStatus(BookingStatus.PENDING_PAYMENT);
        
        // Calculate service types distribution
        List<AdminDashboardStatsDTO.ServiceTypeDistribution> serviceDistribution = 
                calculateServiceDistribution(currentMonth);
        
        // Get recent activities
        List<AdminDashboardStatsDTO.RecentActivity> recentActivities = 
                getRecentActivities();
        
        return AdminDashboardStatsDTO.builder()
                .monthlyRevenue(monthlyRevenue)
                .revenueChangePercent(revenueChangePercent)
                .totalCustomers(totalCustomers)
                .customerChangePercent(customerChangePercent)
                .serviceEfficiency(serviceEfficiency)
                .efficiencyChangePercent(efficiencyChangePercent)
                .staffUtilization(staffUtilization)
                .utilizationChangePercent(utilizationChangePercent)
                .totalBookingsThisMonth(totalBookingsThisMonth)
                .completedBookingsThisMonth(completedBookingsThisMonth)
                .activeStaff(activeStaff)
                .activeTechnicians(activeTechnicians)
                .totalServiceCenters(totalServiceCenters)
                .pendingPaymentBookings(pendingPaymentBookings)
                .serviceDistribution(serviceDistribution)
                .recentActivities(recentActivities)
                .build();
    }
    
    private List<AdminDashboardStatsDTO.ServiceTypeDistribution> calculateServiceDistribution(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        // Get all completed payments in the month (payments have service info)
        List<PaymentEntity> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDateTime) && !p.getCreatedAt().isAfter(endDateTime))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        long totalPayments = payments.size();
        
        if (totalPayments == 0) {
            return new ArrayList<>();
        }
        
        // Count by service type based on service name from payments
        Map<String, Long> serviceTypeCounts = new HashMap<>();
        
        for (PaymentEntity payment : payments) {
            String serviceType = payment.getServiceName();
            
            // If service name is null or empty, try to categorize from description
            if (serviceType == null || serviceType.isEmpty()) {
                serviceType = "Dịch vụ khác";
            }
            
            serviceTypeCounts.put(serviceType, serviceTypeCounts.getOrDefault(serviceType, 0L) + 1);
        }
        
        // Define colors for each service type
        String[] colors = {"#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"};
        int colorIndex = 0;
        
        List<AdminDashboardStatsDTO.ServiceTypeDistribution> distribution = new ArrayList<>();
        
        for (Map.Entry<String, Long> entry : serviceTypeCounts.entrySet()) {
            Long count = entry.getValue();
            Double percentage = (count * 100.0) / totalPayments;
            
            distribution.add(AdminDashboardStatsDTO.ServiceTypeDistribution.builder()
                    .name(entry.getKey())
                    .count(count)
                    .percentage(Math.round(percentage * 10) / 10.0) // Round to 1 decimal
                    .color(colors[colorIndex % colors.length])
                    .build());
            
            colorIndex++;
        }
        
        // Sort by count descending
        distribution.sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        
        return distribution;
    }
    
    private List<AdminDashboardStatsDTO.RecentActivity> getRecentActivities() {
        List<AdminDashboardStatsDTO.RecentActivity> activities = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last24Hours = now.minusHours(24);
        
        // Get recent bookings (last 24 hours)
        List<BookingEntity> recentBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt() != null && b.getCreatedAt().isAfter(last24Hours))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());
        
        for (BookingEntity booking : recentBookings) {
            String message = String.format("Đặt lịch mới từ %s - %s", 
                    booking.getCustomerName(), 
                    booking.getVehicle() != null ? booking.getVehicle().getModel() : "N/A");
            
            activities.add(AdminDashboardStatsDTO.RecentActivity.builder()
                    .id("booking-" + booking.getBookingId())
                    .type("booking")
                    .message(message)
                    .time(formatTimeAgo(booking.getCreatedAt()))
                    .timestamp(booking.getCreatedAt())
                    .build());
        }
        
        // Get recent payments
        List<PaymentEntity> recentPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(last24Hours))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(3)
                .collect(Collectors.toList());
        
        for (PaymentEntity payment : recentPayments) {
            String message = String.format("Thanh toán %s - %,d VNĐ", 
                    payment.getCustomerName(), 
                    payment.getFinalAmount().longValue());
            
            activities.add(AdminDashboardStatsDTO.RecentActivity.builder()
                    .id("payment-" + payment.getPaymentId())
                    .type("payment")
                    .message(message)
                    .time(formatTimeAgo(payment.getCreatedAt()))
                    .timestamp(payment.getCreatedAt())
                    .build());
        }
        
        // Sort all activities by timestamp descending
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        
        // Return top 10 activities
        return activities.stream().limit(10).collect(Collectors.toList());
    }
    
    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "N/A";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(dateTime, now).toMinutes();
        
        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return minutes + " phút trước";
        
        long hours = minutes / 60;
        if (hours < 24) return hours + " giờ trước";
        
        long days = hours / 24;
        if (days == 1) return "Hôm qua";
        if (days < 7) return days + " ngày trước";
        
        return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
    
    private Long calculateMonthlyRevenue(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        // Convert to LocalDateTime for payment queries
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        // Sum all COMPLETED and PAID payments in the month using createdAt (when payment was recorded)
        List<PaymentEntity> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDateTime) && !p.getCreatedAt().isAfter(endDateTime))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                            p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        // Sum finalAmount from all successful payments
        return payments.stream()
                .mapToLong(p -> p.getFinalAmount() != null ? p.getFinalAmount().longValue() : 0L)
                .sum();
    }
    
    private Long countUniqueCustomers(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        return bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(startDate) && !b.getBookingDate().isAfter(endDate))
                .filter(b -> b.getVehicle() != null && b.getVehicle().getOwner() != null)
                .map(b -> b.getVehicle().getOwner().getId())
                .distinct()
                .count();
    }
    
    private Double calculateServiceEfficiency(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        // Get all bookings that should be completed in this month
        List<BookingEntity> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(startDate) && !b.getBookingDate().isAfter(endDate))
                .filter(b -> b.getStatus() != BookingStatus.PENDING_PAYMENT && 
                            b.getStatus() != BookingStatus.CANCELLED)
                .collect(Collectors.toList());
        
        if (bookings.isEmpty()) {
            return 0.0;
        }
        
        // Count completed bookings (considered "on time" if completed)
        // In a real system, you would compare actualCompletionDate vs expectedCompletionDate
        long completedOnTime = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
        
        return (completedOnTime * 100.0) / bookings.size();
    }
    
    private Double calculateStaffUtilization(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        // Calculate total available slots across all service centers
        List<ServiceCenterEntity> centers = centerRepository.findAll();
        
        if (centers.isEmpty()) {
            return 0.0;
        }
        
        // Calculate working hours per day for each center
        long totalAvailableSlots = 0;
        int workingDays = month.lengthOfMonth(); // Use actual days in month
        
        for (ServiceCenterEntity center : centers) {
            if (center.getStartTime() != null && center.getEndTime() != null) {
                // Calculate hours per day (e.g., 08:00-18:00 = 10 hours)
                long hoursPerDay = ChronoUnit.HOURS.between(center.getStartTime(), center.getEndTime());
                
                // Each hour can accommodate maxCapacity bookings
                // Total slots = hours * maxCapacity * working days
                totalAvailableSlots += hoursPerDay * center.getMaxCapacity() * workingDays;
            }
        }
        
        if (totalAvailableSlots == 0) {
            return 0.0;
        }
        
        // Count actual bookings (excluding cancelled and pending payment)
        long actualBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(startDate) && !b.getBookingDate().isAfter(endDate))
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && 
                            b.getStatus() != BookingStatus.PENDING_PAYMENT)
                .count();
        
        // Calculate utilization percentage
        double utilization = (actualBookings * 100.0) / totalAvailableSlots;
        
        // Cap at 100%
        return Math.min(100.0, utilization);
    }
    
    private Long countBookingsInMonth(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        return bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(startDate) && !b.getBookingDate().isAfter(endDate))
                .count();
    }
    
    private Long countCompletedBookingsInMonth(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        return bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(startDate) && !b.getBookingDate().isAfter(endDate))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
    }
    
    private Long countActiveEmployeesByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(u -> u instanceof EmployeeEntity)
                .map(u -> (EmployeeEntity) u)
                .filter(e -> e.getRole() == role)
                .filter(e -> e.getStatus() == UserStatus.ACTIVE)
                .count();
    }
    
    private Double calculateChangePercent(Long current, Long previous) {
        if (previous == null || previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((current - previous) * 100.0) / previous;
    }
}
