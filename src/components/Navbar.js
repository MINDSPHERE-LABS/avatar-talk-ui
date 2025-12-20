// Updated Navbar.js
import React, { useState } from 'react';

const Navbar = ({ currentPage, currentProfile, credits, onNavigate, onBack, onForward, canGoForward, isLoggedIn, onLoginClick }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const getTitle = () => {
    if (currentPage === 'profile' && currentProfile) {
      return currentProfile.name;
    }
    return "Pyarify";
  };

  const showBackButton = currentPage !== 'home';
  const showForwardButton = canGoForward;

  // Function to handle menu item clicks
  const handleMenuItemClick = (action) => {
    setShowMobileMenu(false); // Close the menu
    action(); // Execute the action
  };

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
        <button 
          className="login-btn desktop-only"
          onClick={() => onNavigate('recharge')}
        >
          <i className="fas fa-credit-card"></i>
          Recharge
        </button>
        
        {/* Login button - ALWAYS VISIBLE */}
        {/* <button className="login-btn" onClick={onLoginClick}>
          <i className="fas fa-user"></i>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button> */}
        
        {/* Mobile menu button - Only show recharge in mobile menu */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      {/* Mobile menu dropdown - Only contains recharge now */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <button 
            className="mobile-menu-item" 
            onClick={() => handleMenuItemClick(() => onNavigate('recharge'))}
          >
            <i className="fas fa-credit-card"></i>
            <span>Recharge</span>
          </button>
          <button 
            className="mobile-menu-item" 
            onClick={() => handleMenuItemClick(() => onNavigate('home'))}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;