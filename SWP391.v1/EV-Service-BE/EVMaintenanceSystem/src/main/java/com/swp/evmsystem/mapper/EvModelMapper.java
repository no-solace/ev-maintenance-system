package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.EvModelDTO;
import com.swp.evmsystem.entity.EvModelEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EvModelMapper {
    EvModelDTO toDTO(EvModelEntity entity);
    EvModelEntity toEntity(EvModelDTO dto);
}
