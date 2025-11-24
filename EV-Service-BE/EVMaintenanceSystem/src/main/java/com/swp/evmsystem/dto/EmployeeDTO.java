package com.swp.evmsystem.dto;

import com.swp.evmsystem.enums.WorkingStatus;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO {
    private Integer employeeId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Integer centerId;
    private String centerName;
    private WorkingStatus workingStatus;
}
