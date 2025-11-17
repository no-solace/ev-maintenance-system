package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.entity.ServiceCenterEntity;

import java.util.List;

public interface ServiceCenterService {
    boolean create(ServiceCenterEntity sve);
    List<ServiceCenterDTO> getAllServiceCenters();
}
