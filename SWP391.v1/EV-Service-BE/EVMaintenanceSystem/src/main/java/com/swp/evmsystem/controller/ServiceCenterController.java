package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.service.ServiceCenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceCenterController {
    @Autowired
    private ServiceCenterService serviceCenterService;

    @GetMapping("/centers")
    public ResponseEntity<List<ServiceCenterDTO>> getAllServiceCenters() {
        List<ServiceCenterDTO> centers = serviceCenterService.getAllServiceCenters();
        return ResponseEntity.ok(centers);
    }


}
