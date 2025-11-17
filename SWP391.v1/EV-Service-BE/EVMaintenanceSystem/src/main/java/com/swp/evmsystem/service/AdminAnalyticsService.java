package com.swp.evmsystem.service;

import com.swp.evmsystem.dto.AdminAnalyticsDTO;

public interface AdminAnalyticsService {
    AdminAnalyticsDTO getAnalytics(String periodType, Integer year, Integer period);
}
