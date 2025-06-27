#!/bin/bash

echo "Kitchen Companion - OpenAI Setup"
echo "================================="
echo ""

# Check if OpenAI API key is already set
if [ -n "$OPEN_AI_API_KEY" ]; then
    echo "✅ OpenAI API key is already set in environment variables"
    echo "Current key starts with: ${OPEN_AI_API_KEY:0:10}..."
else
    echo "❌ OpenAI API key is not set in environment variables"
    echo ""
    echo "To set up your OpenAI API key:"
    echo "1. Get your API key from: https://platform.openai.com/api-keys"
    echo "2. Run one of these commands:"
    echo ""
    echo "   For current session only:"
    echo "   export OPEN_AI_API_KEY='your-api-key-here'"
    echo ""
    echo "   For permanent setup (add to ~/.zshrc):"
    echo "   echo 'export OPEN_AI_API_KEY=\"your-api-key-here\"' >> ~/.zshrc"
    echo "   source ~/.zshrc"
    echo ""
    echo "3. Then restart your backend application"
    echo ""
fi

# Test backend connection
echo "Testing backend connection..."
if curl -s http://localhost:8080/api/recipes/test-openai > /dev/null 2>&1; then
    echo "✅ Backend is running on port 8080"
    
    # Test OpenAI connection
    echo "Testing OpenAI API connection..."
    RESPONSE=$(curl -s http://localhost:8080/api/recipes/test-openai)
    echo "Response: $RESPONSE"
    
    if echo "$RESPONSE" | grep -q "successful"; then
        echo "✅ OpenAI API connection is working!"
    else
        echo "❌ OpenAI API connection failed"
        echo "Make sure your API key is correct and has sufficient credits"
    fi
else
    echo "❌ Backend is not running on port 8080"
    echo "Please start the backend with: cd backend && mvn spring-boot:run"
fi

echo ""
echo "If you continue to have issues:"
echo "1. Check that your OpenAI API key is valid"
echo "2. Ensure you have sufficient OpenAI credits"
echo "3. Check the backend console logs for detailed error messages"
echo "4. Verify that the backend is running on port 8080"
