package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.model.ServiceCenterEntity;
import com.swp.evmsystem.model.AddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ServiceCenterMapper {
    @Mapping(source = "centerAddress", target = "centerAddress", qualifiedByName = "addressToString")
    @Mapping(source = "centerAddress.latitude", target = "latitude")
    @Mapping(source = "centerAddress.longitude", target = "longitude")
    ServiceCenterDTO toDTO(ServiceCenterEntity entity);

    @Mapping(target = "centerAddress", ignore = true)
    ServiceCenterEntity toEntity(ServiceCenterDTO dto);

    @Named("addressToString")
    default String addressToString(AddressEntity address) {
        return address != null ? address.toString() : null;
    }
}
