package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.model.CustomerEntity;
import com.swp.evmsystem.mapper.CustomerMapper;
import com.swp.evmsystem.repository.CustomerRepository;
import com.swp.evmsystem.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    final CustomerRepository customerRepository;
    final CustomerMapper mapper;
    
    @Override
    public List<CustomerDTO> getCustomers() {
        List<CustomerEntity> customers = customerRepository.findAll();
        return mapper.toDTOList(customers);
    }
}
