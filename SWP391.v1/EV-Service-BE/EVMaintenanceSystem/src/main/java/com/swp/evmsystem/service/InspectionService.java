package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.InspectionRequestDTO;
import com.swp.evmsystem.dto.InspectionResponseDTO;

public interface InspectionService {
    InspectionResponseDTO createInspection(InspectionRequestDTO request, Integer technicianId);
    
    InspectionResponseDTO getInspectionByBookingId(Integer bookingId);
    
    void approveInspection(Integer inspectionId);
    
    void rejectInspection(Integer inspectionId);
    
    void completeInspection(Integer inspectionId);
    
    InspectionResponseDTO createInspectionForReception(InspectionRequestDTO request, Integer technicianId);
    
    InspectionResponseDTO getInspectionByReceptionId(Integer receptionId);
}
