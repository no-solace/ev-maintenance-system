package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.model.UserEntity;
import com.swp.evmsystem.security.UserEntityDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {
    boolean createUser(UserEntity user);

    UserDTO getUserByUserDetail(UserEntityDetails userDetail);

    int getAllCount();

    Optional<UserEntity> findByPhone(String phone);
    
    List<CustomerDTO> getAllCustomers();
}
