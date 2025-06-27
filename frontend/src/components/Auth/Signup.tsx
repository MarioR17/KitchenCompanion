import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './Auth.css';

type SignupProps = {
  onBack: () => void;
  onSignupSuccess: () => void;
};

const API_BASE = 'http://localhost:8080/api/users';

function Signup({ onBack, onSignupSuccess }: SignupProps) {
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
    dietaryRestrictions: '',
    dietaryPreferences: '',
    cookingLevel: '' as 'Guided Chef' | 'Confident Chef' | 'Advanced Chef' | ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Main signup API call
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create account');
      }

      // Additional API calls for dietary preferences and cooking level
      // TODO: Replace with actual API calls when backend is ready
      const additionalCalls = [
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

      try {
        await Promise.all(additionalCalls);
      } catch (err) {
        console.warn('Additional profile data failed to save:', err);
        // Continue with signup success even if profile data fails
      }
      
      setForm({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '',
        dietaryRestrictions: '',
        dietaryPreferences: '',
        cookingLevel: ''
      });
      onSignupSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Kitchen Companion today</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dietaryRestrictions">Dietary Restrictions</label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={form.dietaryRestrictions}
              onChange={handleChange}
              className="form-textarea"
              placeholder="e.g., Gluten-free, Dairy-free, Nut allergies..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dietaryPreferences">Dietary Preferences</label>
            <textarea
              id="dietaryPreferences"
              name="dietaryPreferences"
              value={form.dietaryPreferences}
              onChange={handleChange}
              className="form-textarea"
              placeholder="e.g., Vegetarian, Vegan, Low-carb, Mediterranean..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookingLevel">Cooking Level</label>
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
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <button onClick={onBack} className="back-button">
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Signup;
