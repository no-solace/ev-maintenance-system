package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.entity.CustomerEntity;
import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.entity.UserEntity;
import com.swp.evmsystem.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    // Entity -> DTO
    public UserDTO toDTO(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setUserId(entity.getId());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setRole(roleToString(entity.getRole()));
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().toString() : null);
        dto.setFullName(getFullNameFromEntity(entity));
        
        // Map employee specific fields
        if (entity instanceof EmployeeEntity employee) {
            if (employee.getCenter() != null) {
                dto.setCenterId(employee.getCenter().getId());
                dto.setCenterName(employee.getCenter().getCenterName());
            }
        }
        
        return dto;
    }

    // DTO -> Entity
    public UserEntity toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        UserEntity entity = createUserEntity(dto);
        entity.setId(dto.getUserId());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        
        if (dto.getRole() != null) {
            entity.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        }
        
        return entity;
    }

    private String roleToString(Role role) {
        if (role == null) {
            return "";
        }
        return role.toString();
    }

    private String getFullNameFromEntity(UserEntity entity) {
        if (entity == null) {
            return "Người dùng";
        }
        
        // Check if entity is CustomerEntity or EmployeeEntity and get fullName
        if (entity instanceof CustomerEntity customer) {
            String fullName = customer.getFullName();
            return fullName != null && !fullName.isEmpty() 
                ? fullName 
                : "Người dùng";
        } else if (entity instanceof EmployeeEntity employee) {
            String fullName = employee.getFullName();
            return fullName != null && !fullName.isEmpty()
                ? fullName 
                : "Người dùng";
        }
        
        // Fallback for other user types
        return "Người dùng";
    }

    private UserEntity createUserEntity(UserDTO dto) {
        if (dto == null || dto.getRole() == null) {
            throw new IllegalArgumentException("userType must not be null");
        }

        return switch (dto.getRole().toUpperCase()) {
            case "CUSTOMER" -> new CustomerEntity();
            case "EMPLOYEE" -> new EmployeeEntity();
            default -> throw new IllegalArgumentException("Unknown user type: " + dto.getRole());
        };
    }
}
