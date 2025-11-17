package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.entity.CustomerEntity;
import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.entity.UserEntity;
import com.swp.evmsystem.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ObjectFactory;

@Mapper(componentModel = "spring")
public interface UserMapper {
    // Entity -> DTO
    @Mapping(source = "role", target = "role", qualifiedByName = "roleToString")
    @Mapping(source = "id", target = "userId")
    @Mapping(target = "fullName", expression = "java(getFullNameFromEntity(entity))")
    UserDTO toDTO(UserEntity entity);

    UserEntity toEntity(UserDTO dto);

    @Named("roleToString")
    default String roleToString(Role role) {
        if (role == null) {
            return "";
        }

        return role.toString();
    }

    default String getFullNameFromEntity(UserEntity entity) {
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

    @ObjectFactory
    default UserEntity createUserEntity(UserDTO dto) {
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
