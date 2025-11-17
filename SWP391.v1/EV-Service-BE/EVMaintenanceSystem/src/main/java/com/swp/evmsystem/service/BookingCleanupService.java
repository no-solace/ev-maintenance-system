package com.swp.evmsystem.service;

import com.swp.evmsystem.constants.BookingConstants;
import com.swp.evmsystem.entity.BookingEntity;
import com.swp.evmsystem.entity.ElectricVehicleEntity;
import com.swp.evmsystem.enums.BookingStatus;
import com.swp.evmsystem.enums.EvMaintenanceStatus;
import com.swp.evmsystem.repository.BookingRepository;
import com.swp.evmsystem.repository.ElectricVehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service to automatically cancel bookings that haven't been paid within 15 minutes
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingCleanupService {

    private final BookingRepository bookingRepository;
    private final ElectricVehicleRepository vehicleRepository;

    /**
     * Runs every 5 minutes to check for expired unpaid bookings
     */
    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    @Transactional
    public void cancelExpiredUnpaidBookings() {
        log.debug("Running scheduled task to cancel expired unpaid bookings");

        try {
            // Find all PENDING_PAYMENT bookings
            List<BookingEntity> pendingPaymentBookings = 
                bookingRepository.findByStatus(BookingStatus.PENDING_PAYMENT);

            LocalDateTime now = LocalDateTime.now();
            int cancelledCount = 0;

            for (BookingEntity booking : pendingPaymentBookings) {
                LocalDateTime createdAt = booking.getCreatedAt();
                
                if (createdAt != null) {
                    // Calculate minutes since booking was created
                    long minutesElapsed = java.time.Duration.between(createdAt, now).toMinutes();

                    // If more than 15 minutes have passed, cancel the booking
                    if (minutesElapsed >= BookingConstants.PAYMENT_TIMEOUT_MINUTES) {
                        log.info("Auto-cancelling booking {} - created {} minutes ago without payment", 
                                booking.getBookingId(), minutesElapsed);

                        booking.setStatus(BookingStatus.CANCELLED);
                        booking.setNotes((booking.getNotes() != null ? booking.getNotes() + "\n" : "") 
                                + "Auto-cancelled: Payment not received within " + BookingConstants.PAYMENT_TIMEOUT_MINUTES + " minutes");

                        // Free up the vehicle
                        ElectricVehicleEntity vehicle = booking.getVehicle();
                        if (vehicle != null && vehicle.getMaintenanceStatus() == EvMaintenanceStatus.BOOKED) {
                            vehicle.setMaintenanceStatus(EvMaintenanceStatus.AVAILABLE);
                            vehicleRepository.save(vehicle);
                        }

                        bookingRepository.save(booking);
                        cancelledCount++;
                    }
                }
            }

            if (cancelledCount > 0) {
                log.info("Auto-cancelled {} expired unpaid bookings", cancelledCount);
            } else {
                log.debug("No expired unpaid bookings found");
            }

        } catch (Exception e) {
            log.error("Error during booking cleanup task", e);
        }
    }
}
