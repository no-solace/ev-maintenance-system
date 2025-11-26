package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.model.ElectricVehicleEntity;
import com.swp.evmsystem.enums.EvMaintenanceStatus;
import com.swp.evmsystem.enums.VehicleModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {OwnerMapper.class})
public interface ElectricVehicleMapper {

    @Mapping(target = "model", source = "model", qualifiedByName = "modelToString")
    @Mapping(target = "maintenanceStatus", source = "maintenanceStatus", qualifiedByName = "statusToString")
    @Mapping(target = "owner", source = "owner")
    ElectricVehicleDTO toDTO(ElectricVehicleEntity entity);

    @Mapping(target = "model", ignore = true)
    @Mapping(target = "owner", ignore = true)
    ElectricVehicleEntity toEntity(ElectricVehicleDTO dto);

    @Named("modelToString")
    default String modelToString(VehicleModel model) {
        return model != null ? model.getName() : null;
    }

    @Named("statusToString")
    default String statusToString(EvMaintenanceStatus status) {
        return status != null ? status.name() : null;
    }
}

