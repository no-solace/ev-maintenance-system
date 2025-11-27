package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.ElectricVehicleDTO;
import com.swp.evmsystem.enums.EvMaintenanceStatus;
import com.swp.evmsystem.model.ElectricVehicleEntity;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T11:24:56+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.9 (Microsoft)"
)
@Component
public class ElectricVehicleMapperImpl implements ElectricVehicleMapper {

    @Autowired
    private OwnerMapper ownerMapper;

    @Override
    public ElectricVehicleDTO toDTO(ElectricVehicleEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ElectricVehicleDTO electricVehicleDTO = new ElectricVehicleDTO();

        electricVehicleDTO.setModel( modelToString( entity.getModel() ) );
        electricVehicleDTO.setMaintenanceStatus( statusToString( entity.getMaintenanceStatus() ) );
        electricVehicleDTO.setOwner( ownerMapper.toDTO( entity.getOwner() ) );
        if ( entity.getId() != null ) {
            electricVehicleDTO.setId( entity.getId() );
        }
        electricVehicleDTO.setVin( entity.getVin() );
        electricVehicleDTO.setLicensePlate( entity.getLicensePlate() );
        electricVehicleDTO.setWarrantyStartDate( entity.getWarrantyStartDate() );
        electricVehicleDTO.setWarrantyEndDate( entity.getWarrantyEndDate() );
        electricVehicleDTO.setWarrantyYears( entity.getWarrantyYears() );
        electricVehicleDTO.setPurchaseDate( entity.getPurchaseDate() );
        electricVehicleDTO.setHasWarranty( entity.getHasWarranty() );

        return electricVehicleDTO;
    }

    @Override
    public ElectricVehicleEntity toEntity(ElectricVehicleDTO dto) {
        if ( dto == null ) {
            return null;
        }

        ElectricVehicleEntity.ElectricVehicleEntityBuilder electricVehicleEntity = ElectricVehicleEntity.builder();

        electricVehicleEntity.id( dto.getId() );
        electricVehicleEntity.vin( dto.getVin() );
        electricVehicleEntity.licensePlate( dto.getLicensePlate() );
        electricVehicleEntity.hasWarranty( dto.getHasWarranty() );
        electricVehicleEntity.warrantyStartDate( dto.getWarrantyStartDate() );
        electricVehicleEntity.warrantyEndDate( dto.getWarrantyEndDate() );
        electricVehicleEntity.warrantyYears( dto.getWarrantyYears() );
        electricVehicleEntity.purchaseDate( dto.getPurchaseDate() );
        if ( dto.getMaintenanceStatus() != null ) {
            electricVehicleEntity.maintenanceStatus( Enum.valueOf( EvMaintenanceStatus.class, dto.getMaintenanceStatus() ) );
        }

        return electricVehicleEntity.build();
    }
}
