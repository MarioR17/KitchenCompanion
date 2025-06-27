# OpenAI Configuration

## Setting up the OpenAI API Key

The application requires an OpenAI API key to function properly. You can set this up in several ways:

### Option 1: GitHub Secrets (For CI/CD and Production)
If you're using GitHub Actions or deploying from GitHub:

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `OPEN_AI_API_KEY`
5. Value: Your actual OpenAI API key
6. Click **Add secret**

The GitHub Actions workflow will automatically inject this as an environment variable:
```yaml
env:
  OPEN_AI_API_KEY: ${{ secrets.OPEN_AI_API_KEY }}
```

### Option 2: Local Environment Variable
For local development:

```bash
# For Unix/Linux/macOS
export OPEN_AI_API_KEY=your-actual-api-key-here

# For Windows Command Prompt
set OPEN_AI_API_KEY=your-actual-api-key-here

# For Windows PowerShell
$env:OPEN_AI_API_KEY="your-actual-api-key-here"
```

### Option 3: Update application.properties (Not Recommended for Production)
Edit `src/main/resources/application.properties` and replace the placeholder:

```properties
OPEN_AI_API_KEY=your-actual-api-key-here
```

**⚠️ Warning**: Don't commit real API keys to version control!

## Testing the Connection

The application will automatically test the OpenAI connection when it starts up. You'll see a message in the console indicating whether the connection was successful.

You can also test the connection manually by calling:
```
GET http://localhost:8080/api/recipes/test-openai
```

## Getting an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Copy the key and use it in your configuration

**Important**: Keep your API key secure and never commit it to version control!
