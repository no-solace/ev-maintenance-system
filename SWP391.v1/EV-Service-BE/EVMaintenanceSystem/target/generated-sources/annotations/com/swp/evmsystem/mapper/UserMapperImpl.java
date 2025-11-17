package com.swp.evmsystem.mapper;

import com.swp.evmsystem.dto.response.UserDTO;
import com.swp.evmsystem.entity.UserEntity;
import com.swp.evmsystem.enums.Role;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-17T18:01:13+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.8 (Microsoft)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDTO(UserEntity entity) {
        if ( entity == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setRole( roleToString( entity.getRole() ) );
        userDTO.setUserId( entity.getId() );

        userDTO.setFullName( getFullNameFromEntity(entity) );

        return userDTO;
    }

    @Override
    public UserEntity toEntity(UserDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserEntity userEntity = createUserEntity( dto );

        if ( dto.getRole() != null ) {
            userEntity.setRole( Enum.valueOf( Role.class, dto.getRole() ) );
        }

        return userEntity;
    }
}
