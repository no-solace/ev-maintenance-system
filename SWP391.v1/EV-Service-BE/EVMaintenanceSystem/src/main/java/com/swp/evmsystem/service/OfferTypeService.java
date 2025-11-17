package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.entity.OfferTypeEntity;

import java.util.List;

public interface OfferTypeService {
    List<OfferTypeDTO> findAll();
    OfferTypeEntity createOfferType(OfferTypeEntity offerTypeEntity);
    List<OfferTypeEntity> getAllOfferTypes();
}
