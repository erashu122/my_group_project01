package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final ObjectMapper mapper = new ObjectMapper();

    // =========================
    // ✅ MAIN METHOD
    // =========================
    public Recommendation generateRecommendation(Activity activity) {

        try {
            String prompt = createAdvancedPrompt(activity);

            String aiResponse = geminiService.getAnswer(prompt);

            log.info("🔥 AI RAW RESPONSE: {}", aiResponse);

            return parseAIResponse(activity, aiResponse);

        } catch (Exception e) {
            log.error("❌ AI generation failed", e);
            return defaultResponse(activity);
        }
    }

    // =========================
    // 🔥 PROMPT
    // =========================
    private String createAdvancedPrompt(Activity activity) {

        return """
You are an elite-level fitness coach, sports scientist, and physiologist.

Analyze this workout deeply and professionally.

USER WORKOUT DATA:
- Activity Type: %s
- Duration: %d minutes
- Calories Burned: %d kcal

Respond ONLY in STRICT JSON format:

{
  "analysis": {
    "overall": "",
    "intensity": "",
    "calorieEfficiency": "",
    "riskLevel": ""
  },
  "improvements": [
    {
      "area": "",
      "recommendation": ""
    }
  ],
  "suggestions": [
    {
      "workout": "",
      "description": ""
    }
  ],
  "safety": [
    ""
  ]
}
""".formatted(
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned()
        );
    }

    // =========================
    // ✅ SAFE PARSER (FIXED)
    // =========================
    private Recommendation parseAIResponse(Activity activity, String aiResponse) {

        try {
            JsonNode root = mapper.readTree(aiResponse);

            // ✅ SAFE CHECK 1
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                log.warn("⚠ No candidates in AI response");
                return defaultResponse(activity);
            }

            // ✅ SAFE CHECK 2
            JsonNode parts = candidates.get(0)
                    .path("content")
                    .path("parts");

            if (!parts.isArray() || parts.isEmpty()) {
                log.warn("⚠ No parts in AI response");
                return defaultResponse(activity);
            }

            String rawText = parts.get(0).path("text").asText();

            if (rawText == null || rawText.isEmpty()) {
                log.warn("⚠ Empty AI text");
                return defaultResponse(activity);
            }

            // ✅ CLEAN JSON
            String json = rawText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode data = mapper.readTree(json);

            String analysis = buildAnalysis(data.path("analysis"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(analysis)
                    .improvements(extractList(data.path("improvements"), "area", "recommendation"))
                    .suggestions(extractList(data.path("suggestions"), "workout", "description"))
                    .safety(extractSimpleList(data.path("safety")))
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("❌ Parsing failed", e);
            return defaultResponse(activity);
        }
    }

    // =========================
    // ANALYSIS
    // =========================
    private String buildAnalysis(JsonNode node) {

        return """
Overall: %s

Intensity: %s

Efficiency: %s

Risk Level: %s
""".formatted(
                node.path("overall").asText("N/A"),
                node.path("intensity").asText("N/A"),
                node.path("calorieEfficiency").asText("N/A"),
                node.path("riskLevel").asText("N/A")
        );
    }

    // =========================
    // LIST PARSER
    // =========================
    private List<String> extractList(JsonNode node, String key1, String key2) {

        List<String> list = new ArrayList<>();

        if (node != null && node.isArray()) {
            node.forEach(n -> {
                String k1 = n.path(key1).asText("");
                String k2 = n.path(key2).asText("");

                if (!k1.isEmpty() || !k2.isEmpty()) {
                    list.add("👉 " + k1 + ": " + k2);
                }
            });
        }

        return list.isEmpty()
                ? List.of("No data")
                : list;
    }

    private List<String> extractSimpleList(JsonNode node) {

        List<String> list = new ArrayList<>();

        if (node != null && node.isArray()) {
            node.forEach(n -> {
                String val = n.asText("");
                if (!val.isEmpty()) {
                    list.add("⚠ " + val);
                }
            });
        }

        return list.isEmpty()
                ? List.of("Stay safe")
                : list;
    }

    // =========================
    // DEFAULT RESPONSE
    // =========================
    private Recommendation defaultResponse(Activity activity) {

        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("AI temporarily unavailable")
                .improvements(List.of("Maintain consistency"))
                .suggestions(List.of("Try structured workouts"))
                .safety(List.of("Warm up", "Stay hydrated"))
                .createdAt(LocalDateTime.now())
                .build();
    }
}