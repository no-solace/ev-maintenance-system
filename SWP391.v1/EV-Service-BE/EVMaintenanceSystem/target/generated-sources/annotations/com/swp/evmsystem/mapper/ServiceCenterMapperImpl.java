package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.entity.ServiceCenterEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-17T18:01:13+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class ServiceCenterMapperImpl implements ServiceCenterMapper {

    @Override
    public ServiceCenterDTO toDTO(ServiceCenterEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ServiceCenterDTO.ServiceCenterDTOBuilder serviceCenterDTO = ServiceCenterDTO.builder();

        serviceCenterDTO.centerAddress( addressToString( entity.getCenterAddress() ) );
        serviceCenterDTO.id( entity.getId() );
        serviceCenterDTO.centerName( entity.getCenterName() );
        serviceCenterDTO.centerPhone( entity.getCenterPhone() );
        serviceCenterDTO.startTime( entity.getStartTime() );
        serviceCenterDTO.endTime( entity.getEndTime() );

        return serviceCenterDTO.build();
    }

    @Override
    public ServiceCenterEntity toEntity(ServiceCenterDTO dto) {
        if ( dto == null ) {
            return null;
        }

        ServiceCenterEntity.ServiceCenterEntityBuilder serviceCenterEntity = ServiceCenterEntity.builder();

        serviceCenterEntity.id( dto.getId() );
        serviceCenterEntity.centerName( dto.getCenterName() );
        serviceCenterEntity.centerPhone( dto.getCenterPhone() );
        serviceCenterEntity.startTime( dto.getStartTime() );
        serviceCenterEntity.endTime( dto.getEndTime() );

        return serviceCenterEntity.build();
    }
}
