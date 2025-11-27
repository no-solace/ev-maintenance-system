package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.OwnerDTO;
import com.swp.evmsystem.model.CustomerEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T11:24:56+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Microsoft)"
)
@Component
public class OwnerMapperImpl implements OwnerMapper {

    @Override
    public OwnerDTO toDTO(CustomerEntity entity) {
        if ( entity == null ) {
            return null;
        }

        OwnerDTO.OwnerDTOBuilder ownerDTO = OwnerDTO.builder();

        ownerDTO.name( entity.getFullName() );
        ownerDTO.address( addressToString( entity.getAddress() ) );
        if ( entity.getId() != null ) {
            ownerDTO.id( entity.getId() );
        }
        ownerDTO.phone( entity.getPhone() );
        ownerDTO.email( entity.getEmail() );

        return ownerDTO.build();
    }
}
