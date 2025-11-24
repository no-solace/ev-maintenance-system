package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.EmployeeResponseDTO;
import com.swp.evmsystem.security.UserEntityDetails;
import com.swp.evmsystem.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    /**
     * Get all employees
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    /**
     * Get all technicians
     */
    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllTechnicians() {
        List<EmployeeResponseDTO> technicians = employeeService.getAllTechnicians();
        return ResponseEntity.ok(technicians);
    }

    /**
     * Get technician by ID
     */
    @GetMapping("/technicians/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDTO> getTechnicianById(@PathVariable Integer id) {
        EmployeeResponseDTO technician = employeeService.getTechnicianById(id);
        return ResponseEntity.ok(technician);
    }

    /**
     * Get technicians by service center ID
     */
    @GetMapping("/technicians/center/{centerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getTechniciansByCenter(@PathVariable Integer centerId) {
        List<EmployeeResponseDTO> technicians = employeeService.getTechniciansByCenterId(centerId);
        return ResponseEntity.ok(technicians);
    }

    /**
     * Get technicians from authenticated staff's service center
     */
    @GetMapping("/technicians/my-center")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getMyTechnicians(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        Integer employeeId = userDetails.userEntity().getId();
        List<EmployeeResponseDTO> technicians = employeeService.getTechniciansByEmployeeCenter(employeeId);
        return ResponseEntity.ok(technicians);
    }
}
