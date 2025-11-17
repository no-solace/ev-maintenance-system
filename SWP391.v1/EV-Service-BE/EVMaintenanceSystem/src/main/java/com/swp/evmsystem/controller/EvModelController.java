package com.swp.evmsystem.controller;

import com.swp.evmsystem.dto.response.EvModelDTO;
import com.swp.evmsystem.service.EvModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class EvModelController {
    @Autowired
    private EvModelService evModelService;

    @GetMapping("/api/ev-models")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getEvModels() {
        List<EvModelDTO> evModelDTOs = evModelService.getAllModels();
        return new ResponseEntity<>(evModelDTOs, HttpStatus.OK);
    }
}
