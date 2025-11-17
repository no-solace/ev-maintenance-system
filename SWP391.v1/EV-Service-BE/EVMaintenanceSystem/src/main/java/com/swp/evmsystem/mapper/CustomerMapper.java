package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.CustomerDTO;
import com.swp.evmsystem.entity.AddressEntity;
import com.swp.evmsystem.entity.CustomerEntity;
import com.swp.evmsystem.enums.UserStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ElectricVehicleMapper.class})
public interface CustomerMapper {
    
    @Mapping(target = "address", source = "address", qualifiedByName = "addressToString")
    @Mapping(target = "status", source = "status", qualifiedByName = "statusToString")
    @Mapping(target = "vehicles", source = "vehicle")
    @Mapping(target = "fullName" , source = "fullName")
    CustomerDTO toDTO(CustomerEntity entity);
    
    List<CustomerDTO> toDTOList(List<CustomerEntity> entities);
    
    @Named("addressToString")
    default String addressToString(AddressEntity address) {
        return address != null ? address.toString() : "N/A";
    }
    
    @Named("statusToString")
    default String statusToString(UserStatus status) {
        return status != null ? status.name() : "ACTIVE";
    }
}
