package com.swp.evmsystem.service;

import com.swp.evmsystem.entity.IssueEntity;

import java.util.List;

public interface IssueService {
    List<IssueEntity> getAllIssues();
    
    List<IssueEntity> getIssuesByOfferType(Integer offerTypeId);
    
    IssueEntity createIssue(IssueEntity issue);
    
    IssueEntity getIssueById(Integer id);
}
