package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.entity.ServiceCenterEntity;
import com.swp.evmsystem.entity.AddressEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ServiceCenterMapper {
    @Mapping(source = "centerAddress", target = "centerAddress", qualifiedByName = "addressToString")
    ServiceCenterDTO toDTO(ServiceCenterEntity entity);

    @Mapping(target = "centerAddress", ignore = true)
    ServiceCenterEntity toEntity(ServiceCenterDTO dto);

    @Named("addressToString")
    default String addressToString(AddressEntity address) {
        return address.toString();
    }
}
