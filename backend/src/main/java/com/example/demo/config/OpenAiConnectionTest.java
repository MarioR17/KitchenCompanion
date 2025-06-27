package main.java.com.example.demo.config;

import com.example.demo.services.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class OpenAiConnectionTest implements CommandLineRunner {

    @Autowired
    private OpenAiService openAiService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Testing OpenAI API connection on startup...");
        
        boolean isConnected = openAiService.testOpenAiConnection();
        
        if (isConnected) {
            System.out.println("✅ OpenAI API connection successful!");
        } else {
            System.err.println("❌ OpenAI API connection failed! Please check your API key configuration.");
            System.err.println("💡 Make sure to set the OPEN_AI_API_KEY environment variable or update application.properties");
        }
    }
}
