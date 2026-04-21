package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    // ✅ CREATE
    public ActivityResponse trackActivity(ActivityRequest request) {

        Activity activity = new Activity();

        activity.setActivityType(request.getActivityType());
        activity.setDuration(request.getDuration());
        activity.setCaloriesBurned(request.getCaloriesBurned());

        // 🔥 IMPORTANT
        activity.setUserId(request.getUserId());

        Activity saved = activityRepository.save(activity);

        return map(saved);
    }

    // ✅ USER SPECIFIC DATA
    public List<ActivityResponse> getUserActivities(String userId) {
        return activityRepository.findByUserId(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    // ✅ GET ONE
    public ActivityResponse getActivityById(String id) {

        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        return map(activity);
    }

    // ✅ MAPPER
    private ActivityResponse map(Activity activity) {
        ActivityResponse res = new ActivityResponse();

        res.setId(activity.getId());
        res.setActivityType(activity.getActivityType());
        res.setDuration(activity.getDuration());
        res.setCaloriesBurned(activity.getCaloriesBurned());
        res.setUserId(activity.getUserId());

        return res;
    }
}