package com.fitness.aiservice.controller;

import com.fitness.aiservice.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class DietController {

    private final GeminiService geminiService;

    @PostMapping("/diet")
    public String generateDiet(@RequestBody Map<String, Object> req) {

        String goal = (String) req.get("goal");
        int calories = (int) req.get("calories");

        String prompt = """
You are a certified nutritionist.

Create a FULL DAY diet plan.

Include:
- Breakfast
- Lunch
- Dinner
- Snacks
- Protein intake
- Hydration

Goal: %s
Calories target: %d

Give detailed meal plan.
""".formatted(goal, calories);

        return geminiService.getAnswer(prompt);
    }
}