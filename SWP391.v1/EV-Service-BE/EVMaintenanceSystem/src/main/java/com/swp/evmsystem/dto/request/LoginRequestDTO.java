package com.swp.evmsystem.dto.request;

import com.swp.evmsystem.validation.annotation.ValidUsername;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    @ValidUsername
    private String username;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}