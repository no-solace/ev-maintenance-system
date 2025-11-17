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
     * Get all technicians (ADMIN only)
     * @return List of all technicians across all centers
     */
    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllTechnicians() {
        List<EmployeeResponseDTO> technicians = employeeService.getAllTechnicians();
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technicians by service center ID (ADMIN only)
     * Staff should use /technicians/my-center endpoint instead
     * @param centerId Service center ID
     * @return List of technicians in the specified center
     */
    @GetMapping("/technicians/center/{centerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getTechniciansByCenter(@PathVariable Integer centerId) {
        List<EmployeeResponseDTO> technicians = employeeService.getTechniciansByCenterId(centerId);
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technicians from the authenticated staff's service center
     * @param userDetails Current authenticated user
     * @return List of technicians in the same center as the staff
     */
    @GetMapping("/technicians/my-center")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<EmployeeResponseDTO>> getMyTechnicians(
            @AuthenticationPrincipal UserEntityDetails userDetails) {
        Integer employeeId = userDetails.userEntity().getId();
        List<EmployeeResponseDTO> technicians = employeeService.getTechniciansByEmployeeCenter(employeeId);
        return ResponseEntity.ok(technicians);
    }
    
    /**
     * Get technician by ID (ADMIN only)
     * @param id Technician ID
     * @return Technician details
     */
    @GetMapping("/technicians/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDTO> getTechnicianById(@PathVariable Integer id) {
        EmployeeResponseDTO technician = employeeService.getTechnicianById(id);
        return ResponseEntity.ok(technician);
    }
}
