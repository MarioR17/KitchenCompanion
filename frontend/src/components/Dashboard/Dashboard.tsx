import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './Dashboard.css';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dietaryRestrictions: string;
  dietaryPreferences: string;
  cookingLevel: string;
};

const API_BASE = 'http://localhost:8080/api';

type DashboardProps = {
  onLogout: () => void;
};

function Dashboard({ onLogout }: DashboardProps) {
  // Mock user data - in a real app, this would come from authentication/session
  const [currentUser] = useState<User>({
    id: 1,
    firstName: 'Chef',
    lastName: 'User',
    email: 'chef@example.com',
    dietaryRestrictions: 'No nuts, Dairy-free',
    dietaryPreferences: 'Mediterranean, Low-carb',
    cookingLevel: 'Confident Chef'
  });

  const [recipeInput, setRecipeInput] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRecipeInput(e.target.value);
  };

  const generateRecipe = async (e: FormEvent) => {
    e.preventDefault();
    if (!recipeInput.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedRecipe('');

    try {
      // Create the request with user profile and input
      const requestData = {
        userInput: recipeInput,
        dietaryRestrictions: currentUser.dietaryRestrictions,
        dietaryPreferences: currentUser.dietaryPreferences,
        cookingLevel: currentUser.cookingLevel,
        userName: currentUser.firstName
      };

      console.log('Sending request:', requestData);

      const response = await fetch(`${API_BASE}/recipes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const recipe = await response.text();
      console.log('Received recipe:', recipe);

      // Check if the response indicates an error
      if (recipe.toLowerCase().includes('failed to generate recipe') || 
          recipe.toLowerCase().includes('error generating recipe') ||
          recipe.toLowerCase().includes('api key')) {
        throw new Error(recipe);
      }

      setGeneratedRecipe(recipe);
    } catch (err) {
      console.error('Error generating recipe:', err);
      const errorMessage = (err as Error).message;
      
      if (errorMessage.includes('API key')) {
        setError('OpenAI API is not properly configured. Please contact the administrator.');
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Kitchen Companion</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="recipe-section">
          <h2 className="chef-greeting">
            What do you want to make today, Chef {currentUser.firstName}?
          </h2>
          
          <form onSubmit={generateRecipe} className="recipe-form">
            <div className="form-group">
              <textarea
                value={recipeInput}
                onChange={handleInputChange}
                placeholder="Tell me what you want to cook! You can mention ingredients you have, the type of cuisine you're craving, or anything else..."
                className="recipe-input"
                rows={4}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !recipeInput.trim()}
              className="generate-button"
            >
              {loading ? 'Creating your recipe...' : 'Generate Recipe'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {generatedRecipe && (
            <div className="recipe-result">
              <h3>Your Personalized Recipe:</h3>
              <div className="recipe-content">
                {generatedRecipe}
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-summary">
          <h3>Your Cooking Profile</h3>
          <div className="profile-item">
            <strong>Cooking Level:</strong> {currentUser.cookingLevel}
          </div>
          <div className="profile-item">
            <strong>Dietary Restrictions:</strong> {currentUser.dietaryRestrictions}
          </div>
          <div className="profile-item">
            <strong>Dietary Preferences:</strong> {currentUser.dietaryPreferences}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
