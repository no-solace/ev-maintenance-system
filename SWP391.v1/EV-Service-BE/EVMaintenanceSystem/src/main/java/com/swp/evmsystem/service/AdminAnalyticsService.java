package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;
import com.swp.evmsystem.dto.response.AdminAnalyticsTimeRangeDTO;

public interface AdminAnalyticsService {

    AdminAnalyticsDTO getAnalytics(String periodType, Integer year, Integer period);
    
    AdminAnalyticsTimeRangeDTO getAnalyticsByTimeRange(String timeRange);
}
