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
}