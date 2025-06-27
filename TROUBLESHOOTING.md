# Kitchen Companion - Recipe Generation Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to generate recipe" Error

This error typically occurs due to one of the following reasons:

#### A. OpenAI API Key Not Configured
**Symptoms:**
- Error message mentions "API key is not configured"
- Backend logs show "OpenAI API key is not configured"

**Solution:**
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Set the environment variable:
   ```bash
   export OPEN_AI_API_KEY="your-actual-api-key-here"
   ```
3. For permanent setup, add to your shell profile:
   ```bash
   echo 'export OPEN_AI_API_KEY="your-actual-api-key-here"' >> ~/.zshrc
   source ~/.zshrc
   ```
4. Restart the backend application

#### B. Invalid OpenAI API Key
**Symptoms:**
- HTTP 401 errors in backend logs
- Error message mentions "Invalid OpenAI API key"

**Solution:**
1. Verify your API key is correct (no extra spaces or characters)
2. Check that your OpenAI account has sufficient credits
3. Ensure the API key has the necessary permissions

#### C. OpenAI API Rate Limiting
**Symptoms:**
- HTTP 429 errors
- Error message mentions "rate limit exceeded"

**Solution:**
1. Wait a few minutes before trying again
2. Consider upgrading your OpenAI plan for higher rate limits

### 2. Backend Connection Issues

#### Backend Not Running
**Symptoms:**
- "Unable to connect to the server" error in frontend
- Connection refused errors

**Solution:**
1. Start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. Verify it's running on port 8080:
   ```bash
   curl http://localhost:8080/api/recipes/test-openai
   ```

#### CORS Issues
**Symptoms:**
- CORS errors in browser console
- Frontend can't communicate with backend

**Solution:**
The application includes CORS configuration, but if issues persist:
1. Check that the frontend is running on the expected port
2. Verify the API_BASE URL in Dashboard.tsx matches your backend URL

### 3. Frontend Issues

#### Empty Recipe Response
**Symptoms:**
- Recipe generation appears to succeed but shows empty content

**Solution:**
1. Check browser console for JavaScript errors
2. Verify the backend is returning valid recipe content
3. Check network tab to see the actual API response

### 4. Testing Your Setup

#### Quick Test Script
Run the setup script to diagnose issues:
```bash
./setup_openai.sh
```

#### Manual Testing Steps

1. **Test Backend Health:**
   ```bash
   curl http://localhost:8080/api/recipes/test-openai
   ```

2. **Test Recipe Generation:**
   ```bash
   curl -X POST http://localhost:8080/api/recipes/generate \
     -H "Content-Type: application/json" \
     -d '{
       "userInput": "pasta with vegetables",
       "dietaryRestrictions": "None",
       "dietaryPreferences": "Italian",
       "cookingLevel": "Beginner",
       "userName": "Test"
     }'
   ```

3. **Check Environment Variables:**
   ```bash
   echo $OPEN_AI_API_KEY
   ```

### 5. Common Configuration Mistakes

1. **API Key in application.properties:**
   - Don't put your actual API key directly in application.properties
   - Use environment variables instead

2. **Wrong API Key Format:**
   - OpenAI API keys start with "sk-"
   - Make sure there are no extra quotes or spaces

3. **Backend Not Restarted:**
   - After setting environment variables, always restart the backend

### 6. Debugging Tips

1. **Enable Debug Logging:**
   Add to application.properties:
   ```properties
   logging.level.com.example.demo=DEBUG
   ```

2. **Check Backend Console:**
   The improved error handling now logs detailed information about:
   - Received requests
   - OpenAI API calls
   - Response details

3. **Browser Developer Tools:**
   - Check Console tab for JavaScript errors
   - Check Network tab to see API calls and responses

### 7. Getting Help

If you're still having issues:

1. **Check the Backend Logs:**
   - Look for detailed error messages in the Spring Boot console
   - The improved error handling provides specific error types

2. **Verify Your OpenAI Account:**
   - Ensure you have an active OpenAI account
   - Check that you have sufficient API credits
   - Verify your API key is active

3. **Test with Simple Request:**
   - Try a simple recipe request like "pasta"
   - Check if the issue is with complex requests or all requests

### 8. Environment Variable Setup Examples

**For macOS/Linux (Bash/Zsh):**
```bash
# Temporary (current session only)
export OPEN_AI_API_KEY="sk-your-key-here"

# Permanent (add to ~/.zshrc or ~/.bash_profile)
echo 'export OPEN_AI_API_KEY="sk-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**For Windows (Command Prompt):**
```cmd
set OPEN_AI_API_KEY=sk-your-key-here
```

**For Windows (PowerShell):**
```powershell
$env:OPEN_AI_API_KEY="sk-your-key-here"
```

Remember to restart your backend application after setting the environment variable!
