package com.fitness.activityservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "activities")
public class Activity {

    @Id
    private String id;

    private String activityType;

    private int duration;

    private int caloriesBurned;

    private String userId;

    // ✅ ADD THESE
    private String intensity;

    private String date;

    private String notes;
}