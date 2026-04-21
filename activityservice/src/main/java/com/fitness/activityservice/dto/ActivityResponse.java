package com.fitness.activityservice.dto;

import lombok.Data;

@Data
public class ActivityResponse {

    private String id;
    private String activityType;
    private int duration;
    private int caloriesBurned;
    private String userId;
}