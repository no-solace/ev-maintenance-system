package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.OwnerDTO;
import com.swp.evmsystem.entity.AddressEntity;
import com.swp.evmsystem.entity.CustomerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OwnerMapper {

    @Mapping(target = "name", source = "fullName")
    @Mapping(target = "address", source = "address", qualifiedByName = "addressToString")
    OwnerDTO toDTO(CustomerEntity entity);

    @Named("addressToString")
    default String addressToString(AddressEntity address) {
        return address != null ? address.toString() : null;
    }
}
