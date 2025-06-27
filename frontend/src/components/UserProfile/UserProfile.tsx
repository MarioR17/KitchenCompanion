import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './UserProfile.css';

type UserProfileProps = {
  onComplete: () => void;
  onBack: () => void;
};

type CookingLevel = 'Guided Chef' | 'Confident Chef' | 'Advanced Chef';

function UserProfile({ onComplete, onBack }: UserProfileProps) {
  const [form, setForm] = useState({
    dietaryRestrictions: '',
    dietaryPreferences: '',
    cookingLevel: '' as CookingLevel | ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value as CookingLevel }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API calls when backend is ready
      console.log('Submitting user profile:', form);
      
      // Simulate API calls
      const promises = [
        // Dietary restrictions API call
        fetch('/api/user/dietary-restrictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restrictions: form.dietaryRestrictions })
        }),
        // Dietary preferences API call
        fetch('/api/user/dietary-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: form.dietaryPreferences })
        }),
        // Cooking level API call
        fetch('/api/user/cooking-level', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: form.cookingLevel })
        })
      ];

      await Promise.all(promises);
      
      // On success, navigate to dashboard
      onComplete();
    } catch (err) {
      console.error('Error submitting profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.dietaryRestrictions.trim() !== '' && 
                     form.dietaryPreferences.trim() !== '' && 
                     form.cookingLevel !== '';

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        
        <h1 className="user-profile-title">Tell us more about you</h1>
        <p className="user-profile-subtitle">
          Help us personalize your cooking experience
        </p>

        <form onSubmit={handleSubmit} className="user-profile-form">
          <div className="form-group">
            <label htmlFor="dietaryRestrictions" className="form-label">
              Dietary Restrictions
            </label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={form.dietaryRestrictions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="e.g., Gluten-free, Dairy-free, Nut allergies..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dietaryPreferences" className="form-label">
              Dietary Preferences
            </label>
            <textarea
              id="dietaryPreferences"
              name="dietaryPreferences"
              value={form.dietaryPreferences}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="e.g., Vegetarian, Vegan, Low-carb, Mediterranean..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookingLevel" className="form-label">
              Cooking Level
            </label>
            <select
              id="cookingLevel"
              name="cookingLevel"
              value={form.cookingLevel}
              onChange={handleSelectChange}
              className="form-select"
              required
            >
              <option value="">Select your cooking level</option>
              <option value="Guided Chef">Guided Chef</option>
              <option value="Confident Chef">Confident Chef</option>
              <option value="Advanced Chef">Advanced Chef</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="submit-button"
          >
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
