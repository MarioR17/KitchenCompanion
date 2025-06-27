import { useState, useEffect } from 'react';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Get current view from URL path
  const getCurrentViewFromPath = (): AppView => {
    const path = window.location.pathname;
    switch (path) {
      case '/':
        return 'landing';
      case '/login':
        return 'login';
      case '/signup':
        return 'signup';
      case '/dashboard':
        return 'dashboard';
      default:
        // For any unknown path, redirect to landing and return landing
        console.warn(`Unknown route: ${path}, redirecting to landing`);
        window.history.replaceState(null, '', '/');
        return 'landing';
    }
  };

  // Initialize view from URL on component mount
  useEffect(() => {
    const viewFromPath = getCurrentViewFromPath();
    setCurrentView(viewFromPath);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const viewFromPath = getCurrentViewFromPath();
      setCurrentView(viewFromPath);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update browser URL when view changes programmatically
  useEffect(() => {
    const expectedPath = currentView === 'landing' ? '/' : `/${currentView}`;
    if (window.location.pathname !== expectedPath) {
      window.history.replaceState(null, '', expectedPath);
    }
  }, [currentView]);

  const navigateTo = (view: AppView) => {
    const path = view === 'landing' ? '/' : `/${view}`;
    setCurrentView(view);
    window.history.pushState(null, '', path);
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
        // If unknown route, redirect to landing
        window.history.replaceState(null, '', '/');
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