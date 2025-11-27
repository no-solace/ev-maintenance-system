package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.model.CustomerEntity;
import com.swp.evmsystem.model.ElectricVehicleEntity;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T11:24:56+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Microsoft)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Autowired
    private ElectricVehicleMapper electricVehicleMapper;

    @Override
    public CustomerDTO toDTO(CustomerEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CustomerDTO.CustomerDTOBuilder customerDTO = CustomerDTO.builder();

        customerDTO.address( addressToString( entity.getAddress() ) );
        customerDTO.status( statusToString( entity.getStatus() ) );
        customerDTO.vehicles( electricVehicleEntityListToElectricVehicleDTOList( entity.getVehicles() ) );
        customerDTO.fullName( entity.getFullName() );
        if ( entity.getId() != null ) {
            customerDTO.id( entity.getId() );
        }
        customerDTO.email( entity.getEmail() );
        customerDTO.phone( entity.getPhone() );

        return customerDTO.build();
    }

    @Override
    public List<CustomerDTO> toDTOList(List<CustomerEntity> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CustomerDTO> list = new ArrayList<CustomerDTO>( entities.size() );
        for ( CustomerEntity customerEntity : entities ) {
            list.add( toDTO( customerEntity ) );
        }

        return list;
    }

    protected List<ElectricVehicleDTO> electricVehicleEntityListToElectricVehicleDTOList(List<ElectricVehicleEntity> list) {
        if ( list == null ) {
            return null;
        }

        List<ElectricVehicleDTO> list1 = new ArrayList<ElectricVehicleDTO>( list.size() );
        for ( ElectricVehicleEntity electricVehicleEntity : list ) {
            list1.add( electricVehicleMapper.toDTO( electricVehicleEntity ) );
        }

        return list1;
    }
}
