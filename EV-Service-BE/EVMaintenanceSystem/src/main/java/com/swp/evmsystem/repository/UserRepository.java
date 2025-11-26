package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.CustomerEntity;
import com.swp.evmsystem.model.EmployeeEntity;
import com.swp.evmsystem.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByPhone(String phone);

    Optional<UserEntity> findByEmail(String email);

    UserEntity save(UserEntity user);

    // Analytics queries for employees
    @Query("SELECT e FROM EmployeeEntity e WHERE e.role IN :roles")
    List<EmployeeEntity> findByRoleIn(@Param("roles") List<String> roles);

    @Query("SELECT COUNT(e) FROM EmployeeEntity e WHERE e.role IN :roles")
    Long countByRoleIn(@Param("roles") List<String> roles);
    
    // Get all customers
    @Query("SELECT c FROM CustomerEntity c WHERE c.role = 'CUSTOMER'")
    List<CustomerEntity> findAllCustomers();
}
