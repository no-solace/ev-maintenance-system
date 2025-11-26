package com.swp.evmsystem.repository;

import com.swp.evmsystem.model.InspectionTaskEntity;
import com.swp.evmsystem.enums.KmInterval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionTaskRepository extends JpaRepository<InspectionTaskEntity, Integer> {
    /**
     * Find inspection tasks by km intervals
     * Used to get cumulative task list for a package level
     */
    List<InspectionTaskEntity> findByKmIntervalIn(List<KmInterval> kmIntervals);
}
