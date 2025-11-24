package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.entity.CustomerEntity;

import java.util.List;

public interface CustomerService {
    
    List<CustomerDTO> getCustomers();
}
