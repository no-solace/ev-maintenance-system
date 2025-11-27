package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.BookingResponseDTO;
import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.dto.response.VehicleReceptionResponseDTO;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.BookingService;
import com.swp.evmsystem.service.CustomerService;
import com.swp.evmsystem.service.ElectricVehicleService;
import com.swp.evmsystem.service.ReceptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    
    private final CustomerService customerService;
    private final BookingService bookingService;
    private final ElectricVehicleService electricVehicleService;
    private final ReceptionService receptionService;

    /**
     * Get all customers
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<CustomerDTO>> getCustomers() {
        return ResponseEntity.ok(customerService.getCustomers());
    }

    /**
     * Get current customer's bookings
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<BookingResponseDTO> bookings =
            bookingService.getBookingsByCustomerId(userDetails.userEntity().getId());
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get current customer's vehicles
     */
    @GetMapping("/my-vehicles")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ElectricVehicleDTO>> getMyVehicles(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<ElectricVehicleDTO> vehicles =
            electricVehicleService.getVehiclesByCustomerId(userDetails.userEntity().getId());
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Get current customer's receptions (maintenance history)
     */
    @GetMapping("/my-receptions")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<VehicleReceptionResponseDTO>> getMyReceptions(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        List<VehicleReceptionResponseDTO> receptions =
            receptionService.getReceptionsByCustomerId(userDetails.userEntity().getId());
        return ResponseEntity.ok(receptions);
    }
}
