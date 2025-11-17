package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.EvModelDTO;
import com.swp.evmsystem.entity.EvModelEntity;

import java.util.List;

public interface EvModelService {
    void createEVModel(EvModelEntity entity);

    EvModelEntity getModelById(int i);

    List<EvModelDTO> getAllModels();
}
