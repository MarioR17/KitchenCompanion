package com.example.demo.controllers;

import com.example.demo.services.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/suggest")
    public String getRecipe(@RequestBody List<String> ingredients) {
        try {
            return openAiService.getRecipeFromOpenAi(ingredients);
        } catch (Exception e) {
            return "Error fetching recipe: " + e.getMessage();
        }
    }

    @GetMapping("/test-openai")
    public String testOpenAi() {
        try {
            boolean isConnected = openAiService.testOpenAiConnection();
            if (isConnected) {
                return "OpenAI connection successful! API key is working.";
            } else {
                return "OpenAI connection failed. Please check API key and configuration.";
            }
        } catch (Exception e) {
            return "Error testing OpenAI connection: " + e.getMessage();
        }
    }

    @PostMapping("/generate")
    public String generatePersonalizedRecipe(@RequestBody RecipeRequest request) {
        try {
            System.out.println("Received recipe generation request for user: " + request.getUserName());
            System.out.println("User input: " + request.getUserInput());
            
            if (request.getUserInput() == null || request.getUserInput().trim().isEmpty()) {
                return "Error: Please provide a description of what you want to cook.";
            }
            
            String recipe = openAiService.getPersonalizedRecipe(request);
            System.out.println("Successfully generated recipe");
            return recipe;
        } catch (Exception e) {
            System.err.println("Error generating recipe: " + e.getMessage());
            e.printStackTrace();
            
            if (e.getMessage().contains("API key")) {
                return "Failed to generate recipe: OpenAI API key is not properly configured. Please check the server configuration.";
            } else if (e.getMessage().contains("401")) {
                return "Failed to generate recipe: Invalid OpenAI API key. Please check the API key configuration.";
            } else if (e.getMessage().contains("429")) {
                return "Failed to generate recipe: OpenAI API rate limit exceeded. Please try again later.";
            } else if (e.getMessage().contains("500")) {
                return "Failed to generate recipe: OpenAI service is temporarily unavailable. Please try again later.";
            } else {
                return "Failed to generate recipe: " + e.getMessage();
            }
        }
    }

    public static class RecipeRequest {
        public String userInput;
        public String dietaryRestrictions;
        public String dietaryPreferences;
        public String cookingLevel;
        public String userName;
        
        // Getters and setters
        public String getUserInput() { return userInput; }
        public void setUserInput(String userInput) { this.userInput = userInput; }
        
        public String getDietaryRestrictions() { return dietaryRestrictions; }
        public void setDietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; }
        
        public String getDietaryPreferences() { return dietaryPreferences; }
        public void setDietaryPreferences(String dietaryPreferences) { this.dietaryPreferences = dietaryPreferences; }
        
        public String getCookingLevel() { return cookingLevel; }
        public void setCookingLevel(String cookingLevel) { this.cookingLevel = cookingLevel; }
        
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
    }
}