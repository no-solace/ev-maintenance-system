package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.EmployeeResponseDTO;
import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.exception.ResourceNotFoundException;
import com.swp.evmsystem.repository.EmployeeRepository;
import com.swp.evmsystem.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    
    private final EmployeeRepository employeeRepository;
    
    @Override
    public List<EmployeeResponseDTO> getAllTechnicians() {
        log.debug("Fetching all technicians");
        List<EmployeeEntity> technicians = employeeRepository.findAllTechnicians();
        return technicians.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<EmployeeResponseDTO> getTechniciansByCenterId(Integer centerId) {
        log.debug("Fetching technicians for center: {}", centerId);
        List<EmployeeEntity> technicians = employeeRepository.findTechniciansByCenterId(centerId);
        return technicians.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<EmployeeResponseDTO> getTechniciansByEmployeeCenter(Integer employeeId) {
        log.debug("Fetching technicians for employee's center: {}", employeeId);
        
        // Get the employee
        EmployeeEntity employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        // Validate employee has a center
        if (employee.getCenter() == null) {
            throw new IllegalStateException("Employee is not assigned to any service center");
        }
        
        // Get technicians from the same center
        Integer centerId = employee.getCenter().getId();
        List<EmployeeEntity> technicians = employeeRepository.findTechniciansByCenterId(centerId);
        
        log.debug("Found {} technicians in center {}", technicians.size(), centerId);
        
        return technicians.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public EmployeeResponseDTO getTechnicianById(Integer id) {
        log.debug("Fetching technician with id: {}", id);
        EmployeeEntity technician = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + id));
        return convertToDTO(technician);
    }

    @Override
    public List<EmployeeResponseDTO> getAllEmployees() {
        log.debug("Fetching all employees (ADMIN, STAFF, TECHNICIAN)");
        List<EmployeeEntity> employees = employeeRepository.findAll();
        return employees.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeResponseDTO getEmployeeById(Integer id) {
        log.debug("Fetching employee with id: {}", id);
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return convertToDTO(employee);
    }

    // Helper method to convert entity to DTO
    private EmployeeResponseDTO convertToDTO(EmployeeEntity employee) {
        return EmployeeResponseDTO.builder()
                .employeeId(employee.getId())
                .name(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .role(employee.getRole().name())
                .centerId(employee.getCenter() != null ? employee.getCenter().getId() : null)
                .centerName(employee.getCenter() != null ? employee.getCenter().getCenterName() : null)
                .workingStatus(employee.getWorkingStatus() != null ? employee.getWorkingStatus().name() : null)
                .status(employee.getStatus().name())
                .build();
    }
}
