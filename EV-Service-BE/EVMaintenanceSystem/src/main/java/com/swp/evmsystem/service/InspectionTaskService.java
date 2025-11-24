package com.swp.evmsystem.service;

import com.swp.evmsystem.entity.InspectionTaskEntity;
import com.swp.evmsystem.enums.PackageLevel;

import java.util.List;

public interface InspectionTaskService {
    /**
     * Get all inspection tasks for a specific package level
     * This includes tasks from current level and all previous levels
     * 
     * For example:
     * - LEVEL_1 (1000km): Returns tasks with kmInterval = ONE_THOUSAND
     * - LEVEL_2 (5000km): Returns tasks with kmInterval = ONE_THOUSAND + FIVE_THOUSAND
     * - LEVEL_3 (10000km): Returns tasks with kmInterval = ONE_THOUSAND + FIVE_THOUSAND + TEN_THOUSAND
     */
    List<InspectionTaskEntity> getTasksForPackageLevel(PackageLevel packageLevel);
    
    /**
     * Get all inspection tasks
     */
    List<InspectionTaskEntity> getAllTasks();
}
