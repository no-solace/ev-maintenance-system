package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;

import java.util.List;

public interface CenterService {
    List<ServiceCenterDTO> getCenters();
}
