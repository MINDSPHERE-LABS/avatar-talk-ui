// screenshotProtection.js

class ScreenshotProtection {
  constructor() {
    this.isProtected = false;
    this.init();
  }

  init() {
    // Detect mobile devices
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (this.isMobile) {
      this.setupMobileProtection();
    }
    
    this.setupDesktopProtection();
    this.setupEventListeners();
  }

  setupMobileProtection() {
    // Mobile-specific protection
    console.log('Mobile screenshot protection enabled');
    
    // Disable text selection
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    // Prevent context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  setupDesktopProtection() {
    // Desktop-specific protection
    console.log('Desktop screenshot protection enabled');
    
    // Detect print screen key
    document.addEventListener('keydown', (e) => {
      // Detect Print Screen key (44) or Alt+Print Screen
      if (e.keyCode === 44 || (e.altKey && e.keyCode === 44)) {
        this.triggerProtection();
      }
    });
  }

  setupEventListeners() {
    // Detect right-click for potential screenshot tools
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) { // Right click
        this.triggerProtection();
      }
    });

    // Detect developer tools (F12, Ctrl+Shift+I, etc.)
    let devToolsOpen = false;
    setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (!devToolsOpen && (widthThreshold || heightThreshold)) {
        devToolsOpen = true;
        this.triggerProtection();
      }
    }, 1000);

    // Detect browser zoom (often used before screenshots)
    let lastZoom = window.outerWidth / window.innerWidth;
    setInterval(() => {
      const currentZoom = window.outerWidth / window.innerWidth;
      if (Math.abs(currentZoom - lastZoom) > 0.1) {
        this.triggerProtection();
        lastZoom = currentZoom;
      }
    }, 500);
  }

  triggerProtection() {
    if (this.isProtected) return;
    
    this.isProtected = true;
    document.body.classList.add('screenshot-detected');
    
    // Show warning message
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 10001;
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
    `;
    warning.innerHTML = 'Screenshot protection activated!<br>Content is confidential.';
    document.body.appendChild(warning);

    // Remove protection after delay
    setTimeout(() => {
      document.body.classList.remove('screenshot-detected');
      if (document.body.contains(warning)) {
        document.body.removeChild(warning);
      }
      this.isProtected = false;
    }, 3000);
  }

  // Method to add user-specific watermark
  addUserWatermark(userId) {
    document.body.setAttribute('data-user-id', userId);
    document.body.setAttribute('data-timestamp', new Date().toISOString());
  }
}

// Initialize protection
const screenshotProtection = new ScreenshotProtection();

// Export for use in React components
export default screenshotProtection;
export const setupScreenshotProtection = () => screenshotProtection;