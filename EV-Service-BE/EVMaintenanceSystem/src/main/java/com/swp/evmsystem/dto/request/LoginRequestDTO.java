package com.swp.evmsystem.dto.request;

import com.swp.evmsystem.validation.annotation.ValidUsername;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequestDTO {
    @ValidUsername
    private String username;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}