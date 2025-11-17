package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;
import com.swp.evmsystem.entity.*;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.enums.PaymentStatus;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.service.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleReceptionRepository receptionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InspectionRepository inspectionRepository;
    
    /**
     * Get analytics by period type
     * @param periodType - MONTH, QUARTER, YEAR
     * @param year - e.g. 2024
     * @param period - for MONTH: 1-12, for QUARTER: 1-4, for YEAR: null
     */
    public AdminAnalyticsDTO getAnalytics(String periodType, Integer year, Integer period) {
        
        LocalDateTime startDate;
        LocalDateTime endDate;
        
        // Calculate date range based on period type
        if ("YEAR".equalsIgnoreCase(periodType)) {
            startDate = LocalDateTime.of(year, 1, 1, 0, 0);
            endDate = LocalDateTime.of(year, 12, 31, 23, 59);
        } else if ("QUARTER".equalsIgnoreCase(periodType)) {
            int startMonth = (period - 1) * 3 + 1;
            int endMonth = startMonth + 2;
            startDate = LocalDateTime.of(year, startMonth, 1, 0, 0);
            endDate = LocalDateTime.of(year, endMonth, 
                    LocalDateTime.of(year, endMonth, 1, 0, 0).toLocalDate().lengthOfMonth(), 23, 59);
        } else { // MONTH
            startDate = LocalDateTime.of(year, period, 1, 0, 0);
            endDate = LocalDateTime.of(year, period, 
                    LocalDateTime.of(year, period, 1, 0, 0).toLocalDate().lengthOfMonth(), 23, 59);
        }
        
        // Build analytics
        return AdminAnalyticsDTO.builder()
                .overview(getOverviewStats(startDate, endDate))
                .revenueByPeriod(getRevenueByPeriod(periodType, year))
                .bookingAnalytics(getBookingAnalytics(startDate, endDate))
                .employeePerformance(getEmployeePerformance(startDate, endDate))
                .build();
    }
    
    /**
     * Overview statistics for the period
     */
    private AdminAnalyticsDTO.OverviewStats getOverviewStats(LocalDateTime startDate, LocalDateTime endDate) {
        
        // Total revenue from completed payments
        List<PaymentEntity> payments = paymentRepository.findByServiceDateBetween(startDate, endDate);
        Double totalRevenue = payments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || p.getPaymentStatus() == PaymentStatus.PAID)
                .mapToDouble(PaymentEntity::getFinalAmount)
                .sum();
        
        // Booking counts
        Long totalBookings = bookingRepository.countByBookingTimeBetween(startDate, endDate);
        
        // Reception counts
        Long totalReceptions = receptionRepository.countByCreatedAtBetween(startDate, endDate);
        
        // Payment counts
        Long totalPayments = (long) payments.size();
        
        // Active employees (STAFF + TECHNICIAN roles)
        Long activeEmployees = userRepository.countByRoleIn(Arrays.asList("STAFF", "TECHNICIAN"));
        
        // Average revenue per booking
        Double averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0.0;
        
        return AdminAnalyticsDTO.OverviewStats.builder()
                .totalRevenue(totalRevenue)
                .totalBookings(totalBookings)
                .totalReceptions(totalReceptions)
                .totalPayments(totalPayments)
                .activeEmployees(activeEmployees)
                .averageRevenuePerBooking(averageRevenue)
                .build();
    }
    
    /**
     * Revenue breakdown by period
     */
    private List<AdminAnalyticsDTO.PeriodRevenue> getRevenueByPeriod(String periodType, Integer year) {
        
        List<AdminAnalyticsDTO.PeriodRevenue> result = new ArrayList<>();
        
        if ("YEAR".equalsIgnoreCase(periodType)) {
            // Last 5 years
            for (int y = year - 4; y <= year; y++) {
                result.add(calculatePeriodRevenue(String.valueOf(y), 
                        LocalDateTime.of(y, 1, 1, 0, 0),
                        LocalDateTime.of(y, 12, 31, 23, 59)));
            }
        } else if ("QUARTER".equalsIgnoreCase(periodType)) {
            // All quarters of the year
            for (int q = 1; q <= 4; q++) {
                int startMonth = (q - 1) * 3 + 1;
                int endMonth = startMonth + 2;
                LocalDateTime start = LocalDateTime.of(year, startMonth, 1, 0, 0);
                LocalDateTime end = LocalDateTime.of(year, endMonth,
                        LocalDateTime.of(year, endMonth, 1, 0, 0).toLocalDate().lengthOfMonth(), 23, 59);
                result.add(calculatePeriodRevenue(year + "-Q" + q, start, end));
            }
        } else { // MONTH
            // All months of the year
            for (int m = 1; m <= 12; m++) {
                LocalDateTime start = LocalDateTime.of(year, m, 1, 0, 0);
                LocalDateTime end = LocalDateTime.of(year, m,
                        start.toLocalDate().lengthOfMonth(), 23, 59);
                result.add(calculatePeriodRevenue(year + "-" + String.format("%02d", m), start, end));
            }
        }
        
        return result;
    }
    
    private AdminAnalyticsDTO.PeriodRevenue calculatePeriodRevenue(String period, 
                                                                     LocalDateTime start, 
                                                                     LocalDateTime end) {
        List<PaymentEntity> payments = paymentRepository.findByServiceDateBetween(start, end);
        
        Double revenue = payments.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || p.getPaymentStatus() == PaymentStatus.PAID)
                .mapToDouble(PaymentEntity::getFinalAmount)
                .sum();
        
        Long bookingCount = bookingRepository.countByBookingTimeBetween(start, end);
        Long receptionCount = receptionRepository.countByCreatedAtBetween(start, end);
        
        Double avgRevenue = (bookingCount + receptionCount) > 0 ? 
                revenue / (bookingCount + receptionCount) : 0.0;
        
        return AdminAnalyticsDTO.PeriodRevenue.builder()
                .period(period)
                .revenue(revenue)
                .bookingCount(bookingCount)
                .receptionCount(receptionCount)
                .averageRevenue(avgRevenue)
                .build();
    }
    
    /**
     * Booking statistics
     */
    private AdminAnalyticsDTO.BookingAnalytics getBookingAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
        
        List<BookingEntity> bookings = bookingRepository.findByBookingTimeBetween(startDate, endDate);
        
        Long total = (long) bookings.size();
        Long completed = bookings.stream()
                .filter(b -> BookingStatus.COMPLETED.equals(b.getStatus()))
                .count();
        Long cancelled = bookings.stream()
                .filter(b -> BookingStatus.CANCELLED.equals(b.getStatus()))
                .count();
        
        Double completionRate = total > 0 ? (completed * 100.0 / total) : 0.0;
        Double cancellationRate = total > 0 ? (cancelled * 100.0 / total) : 0.0;
        
        return AdminAnalyticsDTO.BookingAnalytics.builder()
                .totalBookings(total)
                .completedBookings(completed)
                .cancelledBookings(cancelled)
                .completionRate(completionRate)
                .cancellationRate(cancellationRate)
                .build();
    }
    
    /**
     * Employee performance metrics
     */
    private List<AdminAnalyticsDTO.EmployeePerformance> getEmployeePerformance(LocalDateTime startDate, 
                                                                                 LocalDateTime endDate) {
        
        List<AdminAnalyticsDTO.EmployeePerformance> result = new ArrayList<>();
        
        // Get all employees (STAFF and TECHNICIAN)
        List<EmployeeEntity> employees = userRepository.findByRoleIn(Arrays.asList("STAFF", "TECHNICIAN"));
        
        for (EmployeeEntity employee : employees) {
            
            // For TECHNICIAN: count inspections completed
            Long tasksCompleted = 0L;
            Double revenueGenerated = 0.0;
            
            if ("TECHNICIAN".equalsIgnoreCase(employee.getRole().name())) {
                // Count inspections
                List<InspectionEntity> inspections = inspectionRepository.findByTechnician_Id(employee.getId());
                tasksCompleted = inspections.stream()
                        .filter(i -> i.getCreatedAt().isAfter(startDate) && i.getCreatedAt().isBefore(endDate))
                        .count();
                
                // Calculate revenue from completed inspections
                revenueGenerated = inspections.stream()
                        .filter(i -> i.getCreatedAt().isAfter(startDate) && i.getCreatedAt().isBefore(endDate))
                        .mapToDouble(InspectionEntity::getEstimatedCost)
                        .sum();
            } else if ("STAFF".equalsIgnoreCase(employee.getRole().name())) {
                // Count receptions handled
                List<VehicleReceptionEntity> receptions = receptionRepository.findByAssignedTechnician_Id(employee.getId());
                tasksCompleted = receptions.stream()
                        .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                        .count();
                
                // Calculate revenue from receptions
                revenueGenerated = receptions.stream()
                        .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                        .mapToDouble(VehicleReceptionEntity::getTotalCost)
                        .sum();
            }
            
            // Calculate work hours (assume 8 hours per task for demo)
            Long totalWorkHours = tasksCompleted * 8;
            
            // Efficiency = tasks per hour
            Double efficiency = totalWorkHours > 0 ? tasksCompleted.doubleValue() / totalWorkHours : 0.0;
            
            result.add(AdminAnalyticsDTO.EmployeePerformance.builder()
                    .employeeId(employee.getId())
                    .employeeName(employee.getFullName())
                    .role(employee.getRole().name())
                    .tasksCompleted(tasksCompleted)
                    .revenueGenerated(revenueGenerated)
                    .averageRating(4.5) // Placeholder - can be calculated from reviews
                    .totalWorkHours(totalWorkHours)
                    .efficiency(efficiency)
                    .build());
        }
        
        // Sort by revenue generated (descending)
        result.sort((a, b) -> Double.compare(b.getRevenueGenerated(), a.getRevenueGenerated()));
        
        return result;
    }
}
