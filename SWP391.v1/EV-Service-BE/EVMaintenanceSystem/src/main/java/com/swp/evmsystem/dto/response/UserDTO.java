package com.swp.evmsystem.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Getter
@Setter
public class UserDTO {
    int userId;
    String fullName;
    String role;
}
