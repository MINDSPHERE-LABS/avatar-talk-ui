import React, { useState } from 'react';

const Navbar = ({ currentPage, currentProfile, credits, onNavigate, onBack, onForward, canGoForward }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const getTitle = () => {
    if (currentPage === 'profile' && currentProfile) {
      return currentProfile.name;
    }
    return "Avatar Talk";
  };

  const showBackButton = currentPage !== 'home';
  const showForwardButton = canGoForward;

  return (
    <nav className="navbar">
      <div className="nav-left">
        {showBackButton && (
          <button 
            className="nav-arrow-btn"
            onClick={onBack}
            aria-label="Go back"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <div className="nav-title">
          {getTitle()}
        </div>
        {showForwardButton && (
          <button 
            className="nav-arrow-btn"
            onClick={onForward}
            aria-label="Go forward"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>
      
      <div className="nav-right">
        <div className="credit-display">
          <i className="fas fa-coins"></i>
          <span>{credits} Credits</span>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        
        {/* Desktop login button */}
        <button className="login-btn desktop-only" onClick={() => alert('Login functionality would be implemented here')}>
          Login
        </button>
      </div>
      
      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <button className="mobile-menu-item" onClick={() => alert('Login functionality would be implemented here')}>
            <i className="fas fa-user"></i>
            <span>Login</span>
          </button>
          <button className="mobile-menu-item" onClick={() => onNavigate('recharge')}>
            <i className="fas fa-credit-card"></i>
            <span>Recharge</span>
          </button>
          <button className="mobile-menu-item" onClick={() => onNavigate('home')}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;