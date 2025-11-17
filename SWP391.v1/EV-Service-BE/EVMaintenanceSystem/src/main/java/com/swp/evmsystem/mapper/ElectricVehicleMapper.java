package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.entity.EvModelEntity;
import com.swp.evmsystem.entity.ElectricVehicleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ElectricVehicleMapper {
    @Mapping(target = "model", qualifiedByName = "modelToString")
    @Mapping(target = "hasWarranty", source = "hasWarranty")
    @Mapping(target = "maintenanceStatus", qualifiedByName = "statusToString")
    ElectricVehicleDTO toDTO(ElectricVehicleEntity entity);
    
    @Mapping(target = "model", ignore = true)
    @Mapping(target = "hasWarranty", source = "hasWarranty")
    ElectricVehicleEntity toEntity(ElectricVehicleDTO dto);

    @Named("modelToString")
    default String modelToString(EvModelEntity entity) {
        return entity.getModelName();
    }

    @Named("statusToString")
    default String statusToString(com.swp.evmsystem.enums.EvMaintenanceStatus status) {
        return status != null ? status.name() : null;
    }
}
