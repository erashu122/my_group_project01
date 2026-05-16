package com.fitness.activityservice.dto;

import lombok.Data;

@Data
public class ActivityRequest {

    private String activityType;

    private int duration;

    private int caloriesBurned;

    private String userId;

    // ✅ ADD THESE
    private String intensity;

    private String date;

    private String notes;
}