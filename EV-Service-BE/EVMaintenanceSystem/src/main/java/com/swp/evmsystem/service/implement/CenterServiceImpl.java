package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.dto.response.ServiceCenterDTO;
import com.swp.evmsystem.mapper.ServiceCenterMapper;
import com.swp.evmsystem.repository.CenterRepository;
import com.swp.evmsystem.service.CenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CenterServiceImpl implements CenterService {

    final private CenterRepository repository;
    final private ServiceCenterMapper mapper;

    @Override
    public List<ServiceCenterDTO> getCenters() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)   // chuyển từng Entity → DTO
                .collect(Collectors.toList());
    }
}
