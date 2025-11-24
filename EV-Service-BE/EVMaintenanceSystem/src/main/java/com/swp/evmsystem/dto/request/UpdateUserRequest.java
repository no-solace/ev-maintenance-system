package com.swp.evmsystem.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    
    private String fullName;
    
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải có 10 chữ số")
    private String phoneNumber;
    
    private String address;
    
    private String role;
    
    private String status;
}
