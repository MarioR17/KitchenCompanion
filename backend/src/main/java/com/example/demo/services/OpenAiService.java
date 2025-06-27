package com.example.demo.services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenAiService {
    final String OPENAI_API_KEY = "sk-";

    public String getRecipeFromOpenAi(List<String> ingredients) throws Exception {
        String prompt = "Suggest a recipe idea with the following ingredients: "
                + String.join(", ", ingredients)
                + ". Provide a detailed recipe in plain text.";

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );
        Map<String, Object> jsonBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(message),
                "max_tokens", 500
        );
        String requestBody = mapper.writeValueAsString(jsonBody);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.openai.com/v1/chat/completions"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + OPENAI_API_KEY)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode root = mapper.readTree(response.body());
        String recipe = root
            .path("choices")
            .get(0)
            .path("message")
            .path("content")
            .asText();

        return recipe;
    }
}
