package com.example.demo.services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenAiService {
    
    @Value("${OPEN_AI_API_KEY}")
    private String openaiApiKey;

    public String getRecipeFromOpenAi(List<String> ingredients) throws Exception {
        if (openaiApiKey == null || openaiApiKey.trim().isEmpty() || openaiApiKey.equals("your-openai-api-key-here")) {
            throw new Exception("OpenAI API key is not configured. Please set the OPEN_AI_API_KEY environment variable.");
        }

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
            .header("Authorization", "Bearer " + openaiApiKey)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("OpenAI API Response Status: " + response.statusCode());
        System.out.println("OpenAI API Response Body: " + response.body());

        if (response.statusCode() != 200) {
            throw new Exception("OpenAI API error: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = mapper.readTree(response.body());
        if (!root.has("choices") || root.path("choices").size() == 0) {
            throw new Exception("Invalid response from OpenAI API: " + response.body());
        }

        String recipe = root
            .path("choices")
            .get(0)
            .path("message")
            .path("content")
            .asText();

        if (recipe == null || recipe.trim().isEmpty()) {
            throw new Exception("Empty recipe received from OpenAI API");
        }

        return recipe;
    }

    public boolean testOpenAiConnection() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", "Hello, this is a test. Please respond with 'Hello back!'"
            );
            Map<String, Object> jsonBody = Map.of(
                    "model", "gpt-3.5-turbo",
                    "messages", List.of(message),
                    "max_tokens", 10
            );
            String requestBody = mapper.writeValueAsString(jsonBody);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = mapper.readTree(response.body());
                String testResponse = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
                
                System.out.println("OpenAI Test Response: " + testResponse);
                return true;
            } else {
                System.err.println("OpenAI Test Failed - Status Code: " + response.statusCode());
                System.err.println("Response Body: " + response.body());
                return false;
            }
        } catch (Exception e) {
            System.err.println("OpenAI Test Failed - Exception: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public String getPersonalizedRecipe(Object request) throws Exception {
        if (openaiApiKey == null || openaiApiKey.trim().isEmpty() || openaiApiKey.equals("your-openai-api-key-here")) {
            throw new Exception("OpenAI API key is not configured. Please set the OPEN_AI_API_KEY environment variable.");
        }

        // Extract data from request using reflection to avoid import issues
        String userInput = getFieldValue(request, "userInput");
        String dietaryRestrictions = getFieldValue(request, "dietaryRestrictions");
        String dietaryPreferences = getFieldValue(request, "dietaryPreferences");
        String cookingLevel = getFieldValue(request, "cookingLevel");
        String userName = getFieldValue(request, "userName");

        System.out.println("Generating recipe for user: " + userName);
        System.out.println("User input: " + userInput);
        System.out.println("Dietary restrictions: " + dietaryRestrictions);
        System.out.println("Dietary preferences: " + dietaryPreferences);
        System.out.println("Cooking level: " + cookingLevel);

        String prompt = String.format(
            "Hello %s! Based on your request: '%s'\n\n" +
            "Please create a personalized recipe considering:\n" +
            "- Cooking Level: %s\n" +
            "- Dietary Restrictions: %s\n" +
            "- Dietary Preferences: %s\n\n" +
            "Provide a detailed recipe with ingredients, instructions, and any helpful tips appropriate for a %s level cook. " +
            "Make sure the recipe respects all dietary restrictions and preferences mentioned.",
            userName, userInput, cookingLevel, dietaryRestrictions, dietaryPreferences, cookingLevel
        );

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );
        Map<String, Object> jsonBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(message),
                "max_tokens", 800
        );
        String requestBody = mapper.writeValueAsString(jsonBody);

        System.out.println("Sending request to OpenAI API...");
        System.out.println("Request body: " + requestBody);

        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.openai.com/v1/chat/completions"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + openaiApiKey)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        System.out.println("OpenAI API Response Status: " + response.statusCode());
        System.out.println("OpenAI API Response Body: " + response.body());

        if (response.statusCode() != 200) {
            throw new Exception("OpenAI API error: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = mapper.readTree(response.body());
        if (!root.has("choices") || root.path("choices").size() == 0) {
            throw new Exception("Invalid response from OpenAI API: " + response.body());
        }

        String recipe = root
            .path("choices")
            .get(0)
            .path("message")
            .path("content")
            .asText();

        if (recipe == null || recipe.trim().isEmpty()) {
            throw new Exception("Empty recipe received from OpenAI API");
        }

        return recipe;
    }

    private String getFieldValue(Object obj, String fieldName) {
        try {
            java.lang.reflect.Method getter = obj.getClass().getMethod("get" + 
                fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1));
            Object value = getter.invoke(obj);
            return value != null ? value.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }
}
