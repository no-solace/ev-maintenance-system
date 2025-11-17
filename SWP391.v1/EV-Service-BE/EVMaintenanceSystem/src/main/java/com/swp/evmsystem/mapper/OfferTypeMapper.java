package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.entity.OfferTypeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface OfferTypeMapper {
    @Mapping(source = "offerTypeId", target = "id")
    @Mapping(source = "offerTypeName", target = "name")
    @Mapping(source = "offerTypeDescription", target = "description")
    OfferTypeDTO toDTO(OfferTypeEntity entity);
    OfferTypeEntity toEntity(OfferTypeDTO entity);
}
