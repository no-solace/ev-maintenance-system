package com.swp.evmsystem.security;

import com.swp.evmsystem.entity.EmployeeEntity;
import com.swp.evmsystem.entity.UserEntity;
import com.swp.evmsystem.enums.Role;
import com.swp.evmsystem.enums.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public record UserEntityDetails(UserEntity userEntity) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + userEntity.getRole().toString()));
    }

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        if (userEntity.getPhone() != null) {
            return userEntity.getPhone();
        } else {
            return userEntity.getEmail();
        }
    }

    public int getId() {
        return userEntity.getId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return userEntity.getStatus() == UserStatus.ACTIVE;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return userEntity.getStatus() == UserStatus.ACTIVE;
    }

    /**
     * Get user role
     */
    public Role getRole() {
        return userEntity.getRole();
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin() {
        return userEntity.getRole() == Role.ADMIN;
    }

    /**
     * Check if user is staff
     */
    public boolean isStaff() {
        return userEntity.getRole() == Role.STAFF;
    }

    /**
     * Check if user is technician
     */
    public boolean isTechnician() {
        return userEntity.getRole() == Role.TECHNICIAN;
    }

    /**
     * Check if user is customer
     */
    public boolean isCustomer() {
        return userEntity.getRole() == Role.CUSTOMER;
    }

    /**
     * Get center ID for employee (null for non-employee, admin, or employee without center)
     * Returns null for ADMIN (can see all centers)
     * Returns centerId for STAFF/TECHNICIAN
     */
    public Integer getCenterId() {
        // Admin can see all centers
        if (isAdmin()) {
            return null;
        }

        // For staff and technician, return their center ID
        if (userEntity instanceof EmployeeEntity employee) {
            return employee.getCenter() != null ? employee.getCenter().getId() : null;
        }

        return null;
    }

    /**
     * Check if user has center access (is employee with assigned center)
     */
    public boolean hasCenterAccess() {
        return userEntity instanceof EmployeeEntity employee && employee.getCenter() != null;
    }
}
