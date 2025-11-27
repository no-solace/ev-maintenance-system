package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;
import com.swp.evmsystem.dto.response.AdminAnalyticsTimeRangeDTO;
import com.swp.evmsystem.model.*;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.enums.PaymentStatus;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    final private PaymentRepository paymentRepository;
    final private BookingRepository bookingRepository;
    final private ReceptionRepository receptionRepository;
    final private UserRepository userRepository;
    
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
                // Count receptions assigned to technician
                List<ReceptionEntity> receptions = receptionRepository.findByAssignedTechnician_Id(employee.getId());
                tasksCompleted = receptions.stream()
                        .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                        .count();
                
                // Calculate revenue from receptions
                revenueGenerated = receptions.stream()
                        .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                        .mapToDouble(ReceptionEntity::getTotalCost)
                        .sum();
            } else if ("STAFF".equalsIgnoreCase(employee.getRole().name())) {
                // Count receptions handled
                List<ReceptionEntity> receptions = receptionRepository.findByAssignedTechnician_Id(employee.getId());
                tasksCompleted = receptions.stream()
                        .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                        .count();
                
                // Calculate revenue from receptions
                revenueGenerated = receptions.stream()
                        .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                        .mapToDouble(ReceptionEntity::getTotalCost)
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
    
    /**
     * Get analytics by time range (30DAYS, 3MONTHS, 6MONTHS, 1YEAR)
     */
    @Override
    public AdminAnalyticsTimeRangeDTO getAnalyticsByTimeRange(String timeRange) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate;
        LocalDateTime previousStartDate;
        LocalDateTime previousEndDate;
        int dataPoints;
        String periodFormat;
        
        // Calculate date ranges based on timeRange
        switch (timeRange.toUpperCase()) {
            case "30DAYS":
                startDate = endDate.minusDays(30);
                previousStartDate = startDate.minusDays(30);
                previousEndDate = startDate;
                dataPoints = 6; // Show 6 data points (5-day intervals)
                periodFormat = "DAY";
                break;
            case "3MONTHS":
                startDate = endDate.minusMonths(3);
                previousStartDate = startDate.minusMonths(3);
                previousEndDate = startDate;
                dataPoints = 12; // Show 12 weeks
                periodFormat = "WEEK";
                break;
            case "6MONTHS":
                startDate = endDate.minusMonths(6);
                previousStartDate = startDate.minusMonths(6);
                previousEndDate = startDate;
                dataPoints = 6; // Show 6 months
                periodFormat = "MONTH";
                break;
            case "1YEAR":
                startDate = endDate.minusYears(1);
                previousStartDate = startDate.minusYears(1);
                previousEndDate = startDate;
                dataPoints = 12; // Show 12 months
                periodFormat = "MONTH";
                break;
            default:
                // Default to 6 months
                startDate = endDate.minusMonths(6);
                previousStartDate = startDate.minusMonths(6);
                previousEndDate = startDate;
                dataPoints = 6;
                periodFormat = "MONTH";
        }
        
        // Calculate overview stats
        AdminAnalyticsTimeRangeDTO.OverviewStats overview = calculateOverviewStats(
            startDate, endDate, previousStartDate, previousEndDate
        );
        
        // Calculate trends
        List<AdminAnalyticsTimeRangeDTO.TrendDataPoint> revenueTrends = 
            calculateRevenueTrends(startDate, endDate, dataPoints, periodFormat);
        List<AdminAnalyticsTimeRangeDTO.TrendDataPoint> serviceTrends = 
            calculateServiceTrends(startDate, endDate, dataPoints, periodFormat);
        
        // Calculate service performance
        AdminAnalyticsTimeRangeDTO.ServicePerformance servicePerformance = 
            calculateServicePerformance(startDate, endDate);
        
        // Calculate service type distribution
        List<AdminAnalyticsTimeRangeDTO.ServiceTypeDistribution> serviceTypeDistribution = 
            calculateServiceTypeDistribution(startDate, endDate);
        
        // Calculate customer insights
        AdminAnalyticsTimeRangeDTO.CustomerInsights customerInsights = 
            calculateCustomerInsights(startDate, endDate);
        
        // Calculate top performing services
        List<AdminAnalyticsTimeRangeDTO.TopPerformingService> topPerformingServices = 
            calculateTopPerformingServices(startDate, endDate);
        
        return AdminAnalyticsTimeRangeDTO.builder()
                .overview(overview)
                .revenueTrends(revenueTrends)
                .serviceTrends(serviceTrends)
                .servicePerformance(servicePerformance)
                .serviceTypeDistribution(serviceTypeDistribution)
                .customerInsights(customerInsights)
                .topPerformingServices(topPerformingServices)
                .build();
    }
    
    private AdminAnalyticsTimeRangeDTO.OverviewStats calculateOverviewStats(
            LocalDateTime startDate, LocalDateTime endDate,
            LocalDateTime previousStartDate, LocalDateTime previousEndDate) {
        
        // Current period stats - use createdAt to get all payments created in this period
        List<PaymentEntity> currentPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDate) && !p.getCreatedAt().isAfter(endDate))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        Long totalRevenue = currentPayments.stream()
                .mapToLong(p -> p.getFinalAmount() != null ? p.getFinalAmount().longValue() : 0L)
                .sum();
        
        // Use payments count as totalServices since each payment = 1 service
        Long totalServices = (long) currentPayments.size();
        
        // Count unique customers - use date range for bookings
        Long activeCustomers = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(startDate.toLocalDate()) && 
                           !b.getBookingDate().isAfter(endDate.toLocalDate()))
                .filter(b -> b.getVehicle() != null && b.getVehicle().getOwner() != null)
                .map(b -> b.getVehicle().getOwner().getId())
                .distinct()
                .count();
        
        Long avgServiceValue = totalServices > 0 ? totalRevenue / totalServices : 0L;
        
        // Previous period stats for comparison
        List<PaymentEntity> previousPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(previousStartDate) && !p.getCreatedAt().isAfter(previousEndDate))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        Long previousRevenue = previousPayments.stream()
                .mapToLong(p -> p.getFinalAmount() != null ? p.getFinalAmount().longValue() : 0L)
                .sum();
        
        Long previousServices = (long) previousPayments.size();
        
        Long previousCustomers = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> !b.getBookingDate().isBefore(previousStartDate.toLocalDate()) && 
                           !b.getBookingDate().isAfter(previousEndDate.toLocalDate()))
                .filter(b -> b.getVehicle() != null && b.getVehicle().getOwner() != null)
                .map(b -> b.getVehicle().getOwner().getId())
                .distinct()
                .count();
        
        Long previousAvgValue = previousServices > 0 ? previousRevenue / previousServices : 0L;
        
        // Calculate change percentages
        Double revenueChange = calculatePercentChange(totalRevenue, previousRevenue);
        Double servicesChange = calculatePercentChange(totalServices, previousServices);
        Double customersChange = calculatePercentChange(activeCustomers, previousCustomers);
        Double avgValueChange = calculatePercentChange(avgServiceValue, previousAvgValue);
        
        return AdminAnalyticsTimeRangeDTO.OverviewStats.builder()
                .totalRevenue(totalRevenue)
                .revenueChangePercent(revenueChange)
                .totalServices(totalServices)
                .servicesChangePercent(servicesChange)
                .activeCustomers(activeCustomers)
                .customersChangePercent(customersChange)
                .avgServiceValue(avgServiceValue)
                .avgValueChangePercent(avgValueChange)
                .build();
    }
    
    private List<AdminAnalyticsTimeRangeDTO.TrendDataPoint> calculateRevenueTrends(
            LocalDateTime startDate, LocalDateTime endDate, int dataPoints, String periodFormat) {
        
        List<AdminAnalyticsTimeRangeDTO.TrendDataPoint> trends = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        if ("MONTH".equals(periodFormat)) {
            // Monthly breakdown
            for (int i = 0; i < dataPoints; i++) {
                LocalDateTime periodStart = startDate.plusMonths(i);
                LocalDateTime periodEnd = periodStart.plusMonths(1);
                if (periodEnd.isAfter(endDate)) periodEnd = endDate;
                final LocalDateTime finalPeriodEnd = periodEnd;
                
                Long revenue = paymentRepository.findAll().stream()
                        .filter(p -> p.getCreatedAt() != null)
                        .filter(p -> !p.getCreatedAt().isBefore(periodStart) && !p.getCreatedAt().isAfter(finalPeriodEnd))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                                   p.getPaymentStatus() == PaymentStatus.PAID)
                        .mapToLong(p -> p.getFinalAmount() != null ? p.getFinalAmount().longValue() : 0L)
                        .sum();
                
                trends.add(AdminAnalyticsTimeRangeDTO.TrendDataPoint.builder()
                        .period(periodStart.format(formatter))
                        .value(revenue)
                        .label(periodStart.format(formatter))
                        .build());
            }
        } else if ("WEEK".equals(periodFormat)) {
            // Weekly breakdown
            long days = java.time.Duration.between(startDate, endDate).toDays();
            int weeks = (int) Math.ceil(days / 7.0);
            int step = Math.max(1, weeks / dataPoints);
            
            for (int i = 0; i < dataPoints && i * step * 7 < days; i++) {
                LocalDateTime periodStart = startDate.plusWeeks(i * step);
                LocalDateTime periodEnd = periodStart.plusWeeks(step);
                if (periodEnd.isAfter(endDate)) periodEnd = endDate;
                final LocalDateTime finalPeriodEnd = periodEnd;
                
                Long revenue = paymentRepository.findAll().stream()
                        .filter(p -> p.getCreatedAt() != null)
                        .filter(p -> !p.getCreatedAt().isBefore(periodStart) && !p.getCreatedAt().isAfter(finalPeriodEnd))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                                   p.getPaymentStatus() == PaymentStatus.PAID)
                        .mapToLong(p -> p.getFinalAmount() != null ? p.getFinalAmount().longValue() : 0L)
                        .sum();
                
                trends.add(AdminAnalyticsTimeRangeDTO.TrendDataPoint.builder()
                        .period("W" + (i * step + 1))
                        .value(revenue)
                        .label("Week " + (i * step + 1))
                        .build());
            }
        } else {
            // Day intervals for 30 days
            long days = java.time.Duration.between(startDate, endDate).toDays();
            int step = (int) Math.ceil(days / (double) dataPoints);
            
            for (int i = 0; i < dataPoints; i++) {
                LocalDateTime periodStart = startDate.plusDays(i * step);
                LocalDateTime periodEnd = periodStart.plusDays(step);
                if (periodEnd.isAfter(endDate)) periodEnd = endDate;
                final LocalDateTime finalPeriodEnd = periodEnd;
                
                Long revenue = paymentRepository.findAll().stream()
                        .filter(p -> p.getCreatedAt() != null)
                        .filter(p -> !p.getCreatedAt().isBefore(periodStart) && !p.getCreatedAt().isAfter(finalPeriodEnd))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                                   p.getPaymentStatus() == PaymentStatus.PAID)
                        .mapToLong(p -> p.getFinalAmount() != null ? p.getFinalAmount().longValue() : 0L)
                        .sum();
                
                trends.add(AdminAnalyticsTimeRangeDTO.TrendDataPoint.builder()
                        .period(periodStart.format(DateTimeFormatter.ofPattern("MM/dd")))
                        .value(revenue)
                        .label(periodStart.format(DateTimeFormatter.ofPattern("MM/dd")))
                        .build());
            }
        }
        
        return trends;
    }
    
    private List<AdminAnalyticsTimeRangeDTO.TrendDataPoint> calculateServiceTrends(
            LocalDateTime startDate, LocalDateTime endDate, int dataPoints, String periodFormat) {
        
        List<AdminAnalyticsTimeRangeDTO.TrendDataPoint> trends = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        if ("MONTH".equals(periodFormat)) {
            for (int i = 0; i < dataPoints; i++) {
                LocalDateTime periodStart = startDate.plusMonths(i);
                LocalDateTime periodEnd = periodStart.plusMonths(1);
                if (periodEnd.isAfter(endDate)) periodEnd = endDate;
                final LocalDateTime finalPeriodEnd = periodEnd;
                
                Long count = paymentRepository.findAll().stream()
                        .filter(p -> p.getCreatedAt() != null)
                        .filter(p -> !p.getCreatedAt().isBefore(periodStart) && !p.getCreatedAt().isAfter(finalPeriodEnd))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                                   p.getPaymentStatus() == PaymentStatus.PAID)
                        .count();
                
                trends.add(AdminAnalyticsTimeRangeDTO.TrendDataPoint.builder()
                        .period(periodStart.format(formatter))
                        .value(count)
                        .label(periodStart.format(formatter))
                        .build());
            }
        } else if ("WEEK".equals(periodFormat)) {
            long days = java.time.Duration.between(startDate, endDate).toDays();
            int weeks = (int) Math.ceil(days / 7.0);
            int step = Math.max(1, weeks / dataPoints);
            
            for (int i = 0; i < dataPoints && i * step * 7 < days; i++) {
                LocalDateTime periodStart = startDate.plusWeeks(i * step);
                LocalDateTime periodEnd = periodStart.plusWeeks(step);
                if (periodEnd.isAfter(endDate)) periodEnd = endDate;
                final LocalDateTime finalPeriodEnd = periodEnd;
                
                Long count = paymentRepository.findAll().stream()
                        .filter(p -> p.getCreatedAt() != null)
                        .filter(p -> !p.getCreatedAt().isBefore(periodStart) && !p.getCreatedAt().isAfter(finalPeriodEnd))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                                   p.getPaymentStatus() == PaymentStatus.PAID)
                        .count();
                
                trends.add(AdminAnalyticsTimeRangeDTO.TrendDataPoint.builder()
                        .period("W" + (i * step + 1))
                        .value(count)
                        .label("Week " + (i * step + 1))
                        .build());
            }
        } else {
            long days = java.time.Duration.between(startDate, endDate).toDays();
            int step = (int) Math.ceil(days / (double) dataPoints);
            
            for (int i = 0; i < dataPoints; i++) {
                LocalDateTime periodStart = startDate.plusDays(i * step);
                LocalDateTime periodEnd = periodStart.plusDays(step);
                if (periodEnd.isAfter(endDate)) periodEnd = endDate;
                final LocalDateTime finalPeriodEnd = periodEnd;
                
                Long count = paymentRepository.findAll().stream()
                        .filter(p -> p.getCreatedAt() != null)
                        .filter(p -> !p.getCreatedAt().isBefore(periodStart) && !p.getCreatedAt().isAfter(finalPeriodEnd))
                        .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                                   p.getPaymentStatus() == PaymentStatus.PAID)
                        .count();
                
                trends.add(AdminAnalyticsTimeRangeDTO.TrendDataPoint.builder()
                        .period(periodStart.format(DateTimeFormatter.ofPattern("MM/dd")))
                        .value(count)
                        .label(periodStart.format(DateTimeFormatter.ofPattern("MM/dd")))
                        .build());
            }
        }
        
        return trends;
    }
    
    private AdminAnalyticsTimeRangeDTO.ServicePerformance calculateServicePerformance(
            LocalDateTime startDate, LocalDateTime endDate) {
        
        // Use payments as services since we have payment data
        List<PaymentEntity> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDate) && !p.getCreatedAt().isAfter(endDate))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        if (payments.isEmpty()) {
            return AdminAnalyticsTimeRangeDTO.ServicePerformance.builder()
                    .completionRate(0.0)
                    .avgJobsPerCustomer(0.0)
                    .customerSatisfaction(4.8) // Default
                    .onTimeCompletion(94.2) // Default
                    .firstTimeFixRate(87.5) // Default
                    .build();
        }
        
        // Completion rate - all payments with status COMPLETED or PAID are considered completed
        Double completionRate = 100.0; // All payments in list are already filtered as completed
        
        // Avg jobs per customer
        long uniqueCustomers = payments.stream()
                .filter(p -> p.getCustomerPhone() != null)
                .map(PaymentEntity::getCustomerPhone)
                .distinct()
                .count();
        Double avgJobsPerCustomer = uniqueCustomers > 0 ? 
                (double) payments.size() / uniqueCustomers : 0.0;
        
        // Customer satisfaction (placeholder - would need review system)
        Double customerSatisfaction = 4.8;
        
        // On-time completion (placeholder - would need actual time tracking)
        Double onTimeCompletion = 94.2;
        
        // First-time fix rate (placeholder)
        Double firstTimeFixRate = 87.5;
        
        return AdminAnalyticsTimeRangeDTO.ServicePerformance.builder()
                .completionRate(completionRate)
                .avgJobsPerCustomer(avgJobsPerCustomer)
                .customerSatisfaction(customerSatisfaction)
                .onTimeCompletion(onTimeCompletion)
                .firstTimeFixRate(firstTimeFixRate)
                .build();
    }
    
    private Double calculatePercentChange(Long current, Long previous) {
        if (previous == null || previous == 0) {
            return current != null && current > 0 ? 100.0 : 0.0;
        }
        if (current == null) {
            return -100.0;
        }
        return ((current - previous) * 100.0) / previous;
    }
    
    private List<AdminAnalyticsTimeRangeDTO.ServiceTypeDistribution> calculateServiceTypeDistribution(
            LocalDateTime startDate, LocalDateTime endDate) {
        
        // Get all completed payments in the time range
        List<PaymentEntity> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDate) && !p.getCreatedAt().isAfter(endDate))
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
            
            // If service name is null or empty, categorize as "Other"
            if (serviceType == null || serviceType.isEmpty()) {
                serviceType = "Other Services";
            }
            
            serviceTypeCounts.put(serviceType, serviceTypeCounts.getOrDefault(serviceType, 0L) + 1);
        }
        
        // Define colors for each service type
        String[] colors = {"#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"};
        int colorIndex = 0;
        
        List<AdminAnalyticsTimeRangeDTO.ServiceTypeDistribution> distribution = new ArrayList<>();
        
        for (Map.Entry<String, Long> entry : serviceTypeCounts.entrySet()) {
            Long count = entry.getValue();
            Double percentage = (count * 100.0) / totalPayments;
            
            distribution.add(AdminAnalyticsTimeRangeDTO.ServiceTypeDistribution.builder()
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
    
    private AdminAnalyticsTimeRangeDTO.CustomerInsights calculateCustomerInsights(
            LocalDateTime startDate, LocalDateTime endDate) {
        
        // Get all payments in the time range
        List<PaymentEntity> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDate) && !p.getCreatedAt().isAfter(endDate))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        // Count unique customers based on phone number
        Map<String, Long> customerServiceCounts = new HashMap<>();
        
        for (PaymentEntity payment : payments) {
            String phone = payment.getCustomerPhone();
            if (phone != null && !phone.isEmpty()) {
                customerServiceCounts.put(phone, customerServiceCounts.getOrDefault(phone, 0L) + 1);
            }
        }
        
        Long totalCustomers = (long) customerServiceCounts.size();
        
        // Count repeat customers (customers with more than 1 service)
        Long repeatCustomers = customerServiceCounts.values().stream()
                .filter(count -> count > 1)
                .count();
        
        // Calculate retention rate
        Double retentionRate = totalCustomers > 0 ? 
                (repeatCustomers * 100.0) / totalCustomers : 0.0;
        
        // Count new customers in last 30 days
        LocalDateTime last30Days = endDate.minusDays(30);
        Long newCustomers30Days = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(last30Days) && !p.getCreatedAt().isAfter(endDate))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .filter(p -> p.getCustomerPhone() != null)
                .map(PaymentEntity::getCustomerPhone)
                .distinct()
                .count();
        
        // Calculate average services per customer
        Double avgServicePerCustomer = totalCustomers > 0 ? 
                (double) payments.size() / totalCustomers : 0.0;
        
        return AdminAnalyticsTimeRangeDTO.CustomerInsights.builder()
                .totalCustomers(totalCustomers)
                .repeatCustomers(repeatCustomers)
                .retentionRate(Math.round(retentionRate * 10) / 10.0)
                .newCustomers30Days(newCustomers30Days)
                .avgServicePerCustomer(Math.round(avgServicePerCustomer * 10) / 10.0)
                .build();
    }
    
    private List<AdminAnalyticsTimeRangeDTO.TopPerformingService> calculateTopPerformingServices(
            LocalDateTime startDate, LocalDateTime endDate) {
        
        // Get all completed payments in the time range
        List<PaymentEntity> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> !p.getCreatedAt().isBefore(startDate) && !p.getCreatedAt().isAfter(endDate))
                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED || 
                           p.getPaymentStatus() == PaymentStatus.PAID)
                .collect(Collectors.toList());
        
        // Group by service name and calculate revenue and count
        Map<String, AdminAnalyticsTimeRangeDTO.TopPerformingService> serviceMap = new HashMap<>();
        
        for (PaymentEntity payment : payments) {
            String serviceName = payment.getServiceName();
            if (serviceName == null || serviceName.isEmpty()) {
                serviceName = "Other Services";
            }
            
            Long revenue = payment.getFinalAmount() != null ? payment.getFinalAmount().longValue() : 0L;
            
            if (serviceMap.containsKey(serviceName)) {
                AdminAnalyticsTimeRangeDTO.TopPerformingService existing = serviceMap.get(serviceName);
                serviceMap.put(serviceName, AdminAnalyticsTimeRangeDTO.TopPerformingService.builder()
                        .name(serviceName)
                        .revenue(existing.getRevenue() + revenue)
                        .count(existing.getCount() + 1)
                        .build());
            } else {
                serviceMap.put(serviceName, AdminAnalyticsTimeRangeDTO.TopPerformingService.builder()
                        .name(serviceName)
                        .revenue(revenue)
                        .count(1L)
                        .build());
            }
        }
        
        // Convert to list and sort by revenue descending
        List<AdminAnalyticsTimeRangeDTO.TopPerformingService> topServices = new ArrayList<>(serviceMap.values());
        topServices.sort((a, b) -> Long.compare(b.getRevenue(), a.getRevenue()));
        
        // Return top 5
        return topServices.stream().limit(5).collect(Collectors.toList());
    }
}
