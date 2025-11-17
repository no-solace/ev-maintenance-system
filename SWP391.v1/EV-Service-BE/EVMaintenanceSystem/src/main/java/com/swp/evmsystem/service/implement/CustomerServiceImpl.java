package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.CustomerEntity;
import com.swp.evmsystem.repository.CustomerRepository;
import com.swp.evmsystem.repository.UserRepository;
import com.swp.evmsystem.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    CustomerRepository repository;

    @Override
    public CustomerEntity getCustomerById(Integer id) {
        return repository.getCustomerEntityById(id);
    }
}
