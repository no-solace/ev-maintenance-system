package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.OfferTypeDTO;
import com.swp.evmsystem.entity.OfferTypeEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-17T18:01:13+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class OfferTypeMapperImpl implements OfferTypeMapper {

    @Override
    public OfferTypeDTO toDTO(OfferTypeEntity entity) {
        if ( entity == null ) {
            return null;
        }

        OfferTypeDTO.OfferTypeDTOBuilder offerTypeDTO = OfferTypeDTO.builder();

        offerTypeDTO.id( entity.getOfferTypeId() );
        offerTypeDTO.name( entity.getOfferTypeName() );
        offerTypeDTO.description( entity.getOfferTypeDescription() );

        return offerTypeDTO.build();
    }

    @Override
    public OfferTypeEntity toEntity(OfferTypeDTO entity) {
        if ( entity == null ) {
            return null;
        }

        OfferTypeEntity.OfferTypeEntityBuilder offerTypeEntity = OfferTypeEntity.builder();

        return offerTypeEntity.build();
    }
}
