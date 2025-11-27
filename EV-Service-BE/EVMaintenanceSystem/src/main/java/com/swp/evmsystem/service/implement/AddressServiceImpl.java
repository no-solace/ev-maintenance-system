package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.model.AddressEntity;
import com.swp.evmsystem.repository.AddressRepository;
import com.swp.evmsystem.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    final  AddressRepository addressRepository;

    @Override
    public void createAddress(AddressEntity addressEntity) {
        addressRepository.save(addressEntity);
    }
}
