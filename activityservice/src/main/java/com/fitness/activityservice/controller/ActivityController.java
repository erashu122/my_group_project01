package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    // 🔐 SAFE USER ID EXTRACTOR
    private String getUserId(Jwt jwt) {

        if (jwt == null) {
            throw new RuntimeException("❌ JWT is NULL → Token not received from Gateway");
        }

        return jwt.getSubject(); // Keycloak user id
    }

    // =========================
    // ✅ CREATE ACTIVITY
    // =========================
    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @RequestBody ActivityRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String userId = getUserId(jwt);

        request.setUserId(userId);

        ActivityResponse response = activityService.trackActivity(request);

        return ResponseEntity.ok(response);
    }

    // =========================
    // ✅ GET USER ACTIVITIES
    // =========================
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @AuthenticationPrincipal Jwt jwt) {

        String userId = getUserId(jwt);

        List<ActivityResponse> activities =
                activityService.getUserActivities(userId);

        return ResponseEntity.ok(activities);
    }

    // =========================
    // ✅ GET SINGLE ACTIVITY
    // =========================
    @GetMapping("/id/{activityId}")
    public ResponseEntity<ActivityResponse> getOne(
            @PathVariable String activityId,
            @AuthenticationPrincipal Jwt jwt) {

        String userId = getUserId(jwt);

        ActivityResponse activity =
                activityService.getActivityById(activityId);

        // 🔒 SECURITY CHECK
        if (!activity.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(activity);
    }
}