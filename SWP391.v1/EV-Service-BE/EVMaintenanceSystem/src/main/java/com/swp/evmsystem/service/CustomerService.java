package com.swp.evmsystem.service;

import com.swp.evmsystem.entity.CustomerEntity;

import java.util.Optional;

public interface CustomerService {
    CustomerEntity getCustomerById(Integer id);
}
