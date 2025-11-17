package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.entity.OfferTypeEntity;
import com.swp.evmsystem.mapper.OfferTypeMapper;
import com.swp.evmsystem.repository.OfferTypeRepository;
import com.swp.evmsystem.service.OfferTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferTypeServiceImpl implements OfferTypeService {
    @Autowired
    private OfferTypeRepository repository;
    @Autowired
    private OfferTypeMapper offerTypeMapper;

    @Override
    public List<OfferTypeDTO> findAll() {
        return repository.findAll().stream()
                .map(offerTypeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OfferTypeEntity createOfferType(OfferTypeEntity offerTypeEntity) {
        return repository.save(offerTypeEntity);
    }

    @Override
    public List<OfferTypeEntity> getAllOfferTypes() {
        return repository.findAll();
    }
}
