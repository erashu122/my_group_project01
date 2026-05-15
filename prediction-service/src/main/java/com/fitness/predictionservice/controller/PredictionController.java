package com.fitness.predictionservice.controller;

import com.fitness.predictionservice.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping("/{userId}")
    public String getPrediction(@PathVariable Long userId) {

        return predictionService.generatePrediction(userId);
    }
}