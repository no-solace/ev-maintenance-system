package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.EmployeeResponseDTO;

import java.util.List;

public interface EmployeeService {
    /**
     * Get all technicians
     * @return List of all technicians
     */
    List<EmployeeResponseDTO> getAllTechnicians();
    
    /**
     * Get technicians by service center ID
     * @param centerId Service center ID
     * @return List of technicians in the specified center
     */
    List<EmployeeResponseDTO> getTechniciansByCenterId(Integer centerId);
    
    /**
     * Get technicians from a specific employee's service center
     * @param employeeId Employee ID (staff/admin)
     * @return List of technicians in the same center
     */
    List<EmployeeResponseDTO> getTechniciansByEmployeeCenter(Integer employeeId);
    
    /**
     * Get technician by ID
     * @param id Technician ID
     * @return Technician details
     */
    EmployeeResponseDTO getTechnicianById(Integer id);
    
    /**
     * Get all employees (all roles: ADMIN, STAFF, TECHNICIAN)
     * @return List of all employees
     */
    List<EmployeeResponseDTO> getAllEmployees();
    
    /**
     * Get employee by ID (any role)
     * @param id Employee ID
     * @return Employee details
     */
    EmployeeResponseDTO getEmployeeById(Integer id);
}
