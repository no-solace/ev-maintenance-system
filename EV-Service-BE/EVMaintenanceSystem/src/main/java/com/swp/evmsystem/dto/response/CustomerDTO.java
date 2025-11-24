package com.swp.evmsystem.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    int id;
    String fullName;
    String email;
    String phone;
    String address;
    String status;
    List<ElectricVehicleDTO> vehicles;
}
