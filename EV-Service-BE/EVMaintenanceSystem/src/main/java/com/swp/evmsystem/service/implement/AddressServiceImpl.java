package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.AddressEntity;
import com.swp.evmsystem.repository.AddressRepository;
import com.swp.evmsystem.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    AddressRepository addressRepository;

    @Override
    public void createAddress(AddressEntity addressEntity) {
        addressRepository.save(addressEntity);
    }
}
