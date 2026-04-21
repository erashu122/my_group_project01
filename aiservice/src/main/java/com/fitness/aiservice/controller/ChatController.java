package com.fitness.aiservice.controller;

import com.fitness.aiservice.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> request) {

        String message = request.get("message");

        return geminiService.getAnswer(message);
    }
}