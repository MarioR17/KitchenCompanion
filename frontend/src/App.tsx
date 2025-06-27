import { useState } from 'react';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const showLanding = () => setCurrentView('landing');
  const showLogin = () => setCurrentView('login');
  const showSignup = () => setCurrentView('signup');
  const showDashboard = () => setCurrentView('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onLogin={showLogin} onSignup={showSignup} onGuest={showDashboard} />;
      case 'login':
        return <Login onBack={showLanding} onLoginSuccess={showDashboard} />;
      case 'signup':
        return <Signup onBack={showLanding} onSignupSuccess={showDashboard} />;
      case 'dashboard':
        return <Dashboard onLogout={showLanding} />;
      default:
        return <Landing onLogin={showLogin} onSignup={showSignup} onGuest={showDashboard} />;
    }
  };

  return <div className="app">{renderCurrentView()}</div>;
}

export default App;