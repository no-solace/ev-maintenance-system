package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.IssueEntity;
import com.swp.evmsystem.repository.IssueRepository;
import com.swp.evmsystem.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueServiceImpl implements IssueService {
    
    @Autowired
    private IssueRepository issueRepository;
    
    public List<IssueEntity> getAllIssues() {
        return issueRepository.findAll();
    }
    
    public List<IssueEntity> getIssuesByOfferType(Integer offerTypeId) {
        return issueRepository.findByOfferType_OfferTypeId(offerTypeId);
    }
    
    public IssueEntity createIssue(IssueEntity issue) {
        return issueRepository.save(issue);
    }
    
    public IssueEntity getIssueById(Integer id) {
        return issueRepository.findById(id).orElse(null);
    }
}
