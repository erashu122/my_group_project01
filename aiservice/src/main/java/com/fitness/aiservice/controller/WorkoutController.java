package com.fitness.aiservice.controller;

import com.fitness.aiservice.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class WorkoutController {

    private final GeminiService geminiService;

    @PostMapping("/weekly-plan")
    public String generatePlan(@RequestBody Map<String, Object> req) {

        String level = (String) req.get("level");

        String prompt = """
You are a professional gym trainer.

Create a 7-day workout plan.

Include:
- Day wise plan
- Exercise names
- Sets & reps
- Rest days

Fitness level: %s
""".formatted(level);

        return geminiService.getAnswer(prompt);
    }
}