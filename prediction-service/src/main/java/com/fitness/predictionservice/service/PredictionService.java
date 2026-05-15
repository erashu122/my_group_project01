package com.fitness.predictionservice.service;

import org.springframework.stereotype.Service;

@Service
public class PredictionService {

    public String generatePrediction(Long userId) {

        return """
                AI FITNESS REPORT
                
                Consistency Score: 82%
                Fatigue Risk: Low
                Predicted Fitness Growth: High
                
                Smart Analysis:
                Your workout consistency is excellent.
                Continue regular cardio and strength training.
                
                Future Prediction:
                You may improve your fitness performance by 18% in next 30 days.
                
                AI Recommendation:
                Maintain hydration and proper recovery time.
                """;
    }
}