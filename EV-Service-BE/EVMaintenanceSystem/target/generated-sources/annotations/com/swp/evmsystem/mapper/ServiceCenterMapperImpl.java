package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.model.AddressEntity;
import com.swp.evmsystem.model.ServiceCenterEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T11:24:56+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Microsoft)"
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
        serviceCenterDTO.latitude( entityCenterAddressLatitude( entity ) );
        serviceCenterDTO.longitude( entityCenterAddressLongitude( entity ) );
        serviceCenterDTO.id( entity.getId() );
        serviceCenterDTO.centerName( entity.getCenterName() );
        serviceCenterDTO.centerPhone( entity.getCenterPhone() );
        serviceCenterDTO.startTime( entity.getStartTime() );
        serviceCenterDTO.endTime( entity.getEndTime() );
        serviceCenterDTO.maxCapacity( entity.getMaxCapacity() );

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
        if ( dto.getMaxCapacity() != null ) {
            serviceCenterEntity.maxCapacity( dto.getMaxCapacity() );
        }

        return serviceCenterEntity.build();
    }

    private Double entityCenterAddressLatitude(ServiceCenterEntity serviceCenterEntity) {
        AddressEntity centerAddress = serviceCenterEntity.getCenterAddress();
        if ( centerAddress == null ) {
            return null;
        }
        return centerAddress.getLatitude();
    }

    private Double entityCenterAddressLongitude(ServiceCenterEntity serviceCenterEntity) {
        AddressEntity centerAddress = serviceCenterEntity.getCenterAddress();
        if ( centerAddress == null ) {
            return null;
        }
        return centerAddress.getLongitude();
    }
}
