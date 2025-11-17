package com.swp.evmsystem.repository;

import com.swp.evmsystem.entity.IssueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<IssueEntity, Integer> {
    List<IssueEntity> findByOfferType_OfferTypeId(Integer offerTypeId);
}
