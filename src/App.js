import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import RechargePage from './pages/RechargePage';
import './App.css';
import { setupScreenshotProtection } from './screenshotProtection';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProfile, setCurrentProfile] = useState(null);
  const [credits, setCredits] = useState(150);
  const [navigationHistory, setNavigationHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const protection = setupScreenshotProtection();

  const handleNavigation = (page, profile = null) => {
    setCurrentPage(page);
    setCurrentProfile(profile);

    // Add to navigation history
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(page);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const previousPage = navigationHistory[historyIndex - 1];
      setCurrentPage(previousPage);
      setHistoryIndex(historyIndex - 1);

      // Clear profile if going back to home
      if (previousPage === 'home') {
        setCurrentProfile(null);
      }
    }
  };

  const handleForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const nextPage = navigationHistory[historyIndex + 1];
      setCurrentPage(nextPage);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleRecharge = (amount) => {
    setCredits(credits + amount);
    handleNavigation('home');
  };

  // Determine if forward button should be enabled
  const canGoForward = historyIndex < navigationHistory.length - 1;

  return (
    <div className="App">
      <Navbar
        currentPage={currentPage}
        currentProfile={currentProfile}
        credits={credits}
        onNavigate={handleNavigation}
        onBack={handleBack}
      />

      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigation} />
      )}

      {currentPage === 'profile' && currentProfile && (
        <ProfilePage
          profile={currentProfile}
          onNavigate={handleNavigation}
        />
      )}

      {currentPage === 'recharge' && (
        <RechargePage
          onRecharge={handleRecharge}
          onNavigate={handleNavigation}
        />
      )}
    </div>
  );
}

export default App;