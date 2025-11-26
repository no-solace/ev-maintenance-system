package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.model.InspectionTaskEntity;
import com.swp.evmsystem.enums.KmInterval;
import com.swp.evmsystem.enums.PackageLevel;
import com.swp.evmsystem.repository.InspectionTaskRepository;
import com.swp.evmsystem.service.InspectionTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InspectionTaskServiceImpl implements InspectionTaskService {
    
    private final InspectionTaskRepository inspectionTaskRepository;
    
    @Override
    public List<InspectionTaskEntity> getTasksForPackageLevel(PackageLevel packageLevel) {
        List<KmInterval> applicableIntervals = new ArrayList<>();
        
        // Determine which km intervals to include based on package level
        switch (packageLevel) {
            case LEVEL_3: // 10000km includes all
                applicableIntervals.add(KmInterval.TEN_THOUSAND);
                // fall through
            case LEVEL_2: // 5000km includes 1000km + 5000km
                applicableIntervals.add(KmInterval.FIVE_THOUSAND);
                // fall through
            case LEVEL_1: // 1000km only includes 1000km
                applicableIntervals.add(KmInterval.ONE_THOUSAND);
                break;
        }
        
        // Get all inspection tasks that match the applicable intervals
        return inspectionTaskRepository.findByKmIntervalIn(applicableIntervals);
    }
    
    @Override
    public List<InspectionTaskEntity> getAllTasks() {
        return inspectionTaskRepository.findAll();
    }
}
