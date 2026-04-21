package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public String getAnswer(String prompt) {

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        try {
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("x-goog-api-key", geminiApiKey)// ✅ FINAL FIX
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(20))
                    .block();

            return response != null ? response : fallback();

        } catch (Exception e) {
            log.error("❌ Gemini FAILED: {}", e.getMessage());
            return fallback();
        }
    }

    private String fallback() {
        return """
        {
          "candidates": [
            {
              "content": {
                "parts": [
                  {
                    "text": "{ \\"analysis\\": { \\"overall\\": \\"AI unavailable\\", \\"pace\\": \\"N/A\\", \\"heartRate\\": \\"N/A\\", \\"caloriesBurned\\": \\"N/A\\" }, \\"improvements\\": [], \\"suggestions\\": [], \\"safety\\": [\\"Stay hydrated\\"] }"
                  }
                ]
              }
            }
          ]
        }
        """;
    }
}