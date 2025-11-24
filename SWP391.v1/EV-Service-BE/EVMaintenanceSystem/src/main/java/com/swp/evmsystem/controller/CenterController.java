package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.service.CenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/centers")
@RequiredArgsConstructor
public class CenterController {

    private final CenterService centerService;

    @GetMapping
    public ResponseEntity<List<ServiceCenterDTO>> getAllServiceCenters() {
        List<ServiceCenterDTO> centers = centerService.getCenters();
        return ResponseEntity.ok(centers);
    }
}
