package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.EvModelDTO;
import com.swp.evmsystem.entity.EvModelEntity;
import com.swp.evmsystem.mapper.EvModelMapper;
import com.swp.evmsystem.repository.EvModelRepository;
import com.swp.evmsystem.service.EvModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvModelServiceImpl implements EvModelService {
    @Autowired
    EvModelRepository repository;
    @Autowired
    EvModelMapper mapper;

    @Override
    public void createEVModel(EvModelEntity entity) {
        repository.save(entity);
    }

    @Override
    public EvModelEntity getModelById(int i) {
        return repository.findById(i).get();
    }

    @Override
    public List<EvModelDTO> getAllModels() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
