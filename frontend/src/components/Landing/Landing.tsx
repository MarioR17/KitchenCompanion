import './Landing.css';

type LandingProps = {
  onLogin: () => void;
  onSignup: () => void;
  onGuest: () => void;
};

function Landing({ onLogin, onSignup, onGuest }: LandingProps) {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">ChefMate™</h1>
          <p className="hero-subtitle">
            Empowering Confidence In Every Chef
          </p>
          <p className="hero-description">
            Discover recipes, plan meals, manage ingredients, and cook with confidence. 
            ChefMate makes cooking enjoyable and effortless for everyone.
          </p>
          
          <div className="hero-buttons">
            <button onClick={onSignup} className="cta-button primary">
              Sign Up
            </button>
            <button onClick={onLogin} className="cta-button secondary">
              Sign In
            </button>
            <button onClick={onGuest} className="cta-button guest">
              Continue as Guest
            </button>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="image-placeholder">
            🍳
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose Kitchen Companion?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🥘</div>
            <h3>Smart Recipe Suggestions</h3>
            <p>Get personalized recipe recommendations based on your preferences and available ingredients.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Meal Planning Made Easy</h3>
            <p>Plan your weekly meals, generate shopping lists, and never wonder what's for dinner again.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Ingredient Management</h3>
            <p>Track your pantry, get expiration alerts, and minimize food waste with smart suggestions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
