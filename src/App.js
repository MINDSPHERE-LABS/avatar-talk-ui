import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import RechargePage from './pages/RechargePage';
import LoginPage from './pages/LoginPage'; // Import the LoginPage
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProfile, setCurrentProfile] = useState(null);
  const [credits, setCredits] = useState(150);
  const [navigationHistory, setNavigationHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Check if user is logged in on app load
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

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
    // Check if user is logged in before allowing recharge
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    
    setCredits(credits + amount);
    handleNavigation('home');
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      // Logout functionality
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      alert('Logged out successfully');
    } else {
      // Show login page
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
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
        onForward={handleForward}
        canGoForward={canGoForward}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
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
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => setShowLogin(true)}
        />
      )}

      {/* Login Modal/Page */}
      {showLogin && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onClose={handleCloseLogin}
        />
      )}
    </div>
  );
}

export default App;