import React, { useState, useEffect, useRef } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess, onClose }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const otpInputs = useRef([]);
  const modalRef = useRef();
  const API_BASE_URL = 'http://172.20.10.9:3001';

  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [isCounting, countdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Add this new useEffect for auto-reading OTP
  useEffect(() => {
    if (showOtpSection && autoReadEnabled) {
      const checkAutoRead = async () => {
        // Simulate auto-reading OTP from SMS (in real app, use SMS retriever API)
        setTimeout(() => {
          // For demo purposes, auto-fill with test OTP
          const testOtp = '123456';
          const otpArray = testOtp.split('');
          setOtp(otpArray);
          
          // Auto-submit after filling
          setTimeout(() => {
            handleVerifyOtp();
          }, 1000);
        }, 2000);
      };
      
      checkAutoRead();
    }
  }, [showOtpSection, autoReadEnabled]);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobileNumber(value);
      setError(''); // Clear error when user types
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user types

    // Auto-focus to next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to previous input on backspace
      otpInputs.current[index - 1].focus();
    }
  };

  const handleGetOtp = async () => {
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `+91${mobileNumber}`
        })
      }); 
      // Check if response is OK
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

      if (data.success) {
        alert('OTP generated successfully! Check server console for OTP.');
        // Enable auto-read feature
        setAutoReadEnabled(true);
        
        alert(`OTP sent to +91 ${mobileNumber}`);
        setShowOtpSection(true);
        setCountdown(30);
        setIsCounting(true);

        // Focus on first OTP input
        if (otpInputs.current[0]) {
          otpInputs.current[0].focus();
        }

        // For testing: Auto-fill the OTP after 2 seconds
        if (data.otp) {
          setTimeout(() => {
            const otpArray = data.otp.split('');
            setOtp(otpArray);
            alert(`OTP automatically filled: ${data.otp}`);
          }, 2000);
        }
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `+91${mobileNumber}`,
          otp: enteredOtp
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Login successful!');
        
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('sessionToken', data.sessionToken);
        
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isCounting) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `+91${mobileNumber}`
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`OTP resent to +91 ${mobileNumber}`);
        setCountdown(30);
        setIsCounting(true);
        setOtp(['', '', '', '', '', '']);

        // Focus on first OTP input
        if (otpInputs.current[0]) {
          otpInputs.current[0].focus();
        }
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNumber = () => {
    setShowOtpSection(false);
    setOtp(['', '', '', '', '', '']);
    setIsCounting(false);
    setError('');
    setAutoReadEnabled(false);
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container" ref={modalRef}>
        <div className="login-modal-header">
          <h2>Login to Pyarify</h2>
          <button className="login-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="login-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          {!showOtpSection ? (
            <>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <div className="input-with-flag">
                  <div className="country-code">
                    <i className="fas fa-flag"></i>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    className="form-control"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    maxLength={10}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <button 
                className="btn btn-primary" 
                onClick={handleGetOtp}
                disabled={loading || mobileNumber.length !== 10}
              >
                {loading ? 'Sending OTP...' : 'Send OTP via SMS'}
              </button>

              <div className="sms-info">
                <i className="fas fa-sms"></i>
                <span>OTP will be sent via SMS and auto-read</span>
              </div>
            </>
          ) : (
            <div className="otp-container">
              <div className="form-group">
                <label htmlFor="otp">Enter OTP sent to +91 {mobileNumber}</label>
                <div className="otp-inputs">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputs.current[index] = el)}
                      type="text"
                      className="otp-input"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                className="btn btn-primary" 
                onClick={handleVerifyOtp}
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              
              <button 
                className="btn btn-secondary" 
                onClick={handleEditNumber}
                disabled={loading}
              >
                Edit Mobile Number
              </button>
              
              <div className="resend-otp">
                Didn't receive OTP?{' '}
                <a 
                  href="#" 
                  onClick={handleResendOtp}
                  className={isCounting || loading ? 'disabled' : ''}
                >
                  Resend OTP
                </a>
                {isCounting && (
                  <div className="countdown">({countdown < 10 ? `00:0${countdown}` : `00:${countdown}`})</div>
                )}
              </div>

              {autoReadEnabled && (
                <div className="auto-read-info">
                  <i className="fas fa-robot"></i>
                  <span>Auto-reading OTP from SMS...</span>
                </div>
              )}
            </div>
          )}
          
          <div className="terms">
            By continuing, you agree to our <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;