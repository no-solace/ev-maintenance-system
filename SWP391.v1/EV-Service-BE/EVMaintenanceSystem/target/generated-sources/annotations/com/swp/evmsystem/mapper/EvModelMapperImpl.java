package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.EvModelDTO;
import com.swp.evmsystem.entity.EvModelEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-17T18:01:13+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class EvModelMapperImpl implements EvModelMapper {

    @Override
    public EvModelDTO toDTO(EvModelEntity entity) {
        if ( entity == null ) {
            return null;
        }

        EvModelDTO.EvModelDTOBuilder evModelDTO = EvModelDTO.builder();

        if ( entity.getModelId() != null ) {
            evModelDTO.modelId( entity.getModelId() );
        }
        evModelDTO.modelName( entity.getModelName() );

        return evModelDTO.build();
    }

    @Override
    public EvModelEntity toEntity(EvModelDTO dto) {
        if ( dto == null ) {
            return null;
        }

        EvModelEntity.EvModelEntityBuilder evModelEntity = EvModelEntity.builder();

        evModelEntity.modelId( dto.getModelId() );
        evModelEntity.modelName( dto.getModelName() );

        return evModelEntity.build();
    }
}
