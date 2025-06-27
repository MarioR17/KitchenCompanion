import { useState, useEffect } from 'react';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const view = event.state?.view || 'landing';
      setCurrentView(view);
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state
    if (!window.history.state) {
      window.history.replaceState({ view: 'landing' }, '', '/');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.history.pushState({ view }, '', `/${view === 'landing' ? '' : view}`);
  };

  const showLanding = () => navigateTo('landing');
  const showLogin = () => navigateTo('login');
  const showSignup = () => navigateTo('signup');
  const showDashboard = () => navigateTo('dashboard');

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

  return (
    <div>
      {renderCurrentView()}
    </div>
  );
}

export default App;