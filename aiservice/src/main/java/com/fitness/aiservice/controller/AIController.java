package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.ActivityAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AIController {

    private final ActivityAIService aiService;

    @PostMapping("/analyze")
    public Recommendation analyzeActivity(@RequestBody Activity activity) {
        return aiService.generateRecommendation(activity);
    }
}