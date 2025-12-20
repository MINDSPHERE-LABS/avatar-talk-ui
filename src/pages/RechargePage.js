// Updated RechargePage.js
import React, { useState, useEffect } from 'react';
import { getRechargePlans, processPayment, getUserCredits } from '../services/rechargeService';
import './RechargePage.css';

const RechargePage = ({ onRecharge, onNavigate, isLoggedIn, onLoginRequired }) => {
  const [plans, setPlans] = useState([]);
  const [userCredits, setUserCredits] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    loadPlans();
    loadUserCredits();
  }, []);

  const loadPlans = async () => {
    try {
      const rechargePlans = getRechargePlans();
      // Show only 3 plans
      setPlans(rechargePlans.slice(0, 3));
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadUserCredits = async () => {
    try {
      const credits = await getUserCredits('current-user');
      setUserCredits(credits);
    } catch (error) {
      console.error('Error loading credits:', error);
      setUserCredits(150);
    }
  };

  const handleRecharge = async (plan) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan);

    try {
      const paymentResult = await processPayment(
        plan.id,
        paymentMethod,
        'current-user'
      );

      if (paymentResult.success) {
        const updatedCredits = await getUserCredits('current-user');
        setUserCredits(updatedCredits);
        onRecharge(plan.credits);
        alert(`Successfully recharged ${plan.credits} credits!`);
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Recharge error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="recharge-page">
      <div className="recharge-header">
        <h1 className="recharge-title">Recharge Your Account</h1>
        <div className="current-credits">
          <i className="fas fa-coins"></i>
          <span>Current Credits: {userCredits}</span>
        </div>
        {!isLoggedIn && (
          <div className="login-required-note">
            <i className="fas fa-info-circle"></i>
            <span>Please login to recharge your account</span>
          </div>
        )}
      </div>

      <div className="recharge-plans">
        <h2 className="section-title">Available Plans</h2>
        <div className="plans-horizontal">
          {plans.map(plan => (
            <div 
              key={plan.id} 
              className={`plan-horizontal ${plan.popular ? 'popular' : ''} ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            >
              {plan.popular && <div className="popular-badge">POPULAR</div>}
              
              <div className="plan-details-horizontal">
                <div className="plan-price-horizontal">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price}</span>
                </div>
                
                <div className="plan-credits-horizontal">
                  <i className="fas fa-coins"></i>
                  {plan.credits} Credits
                </div>
                
                <div className="plan-validity-horizontal">
                  <i className="fas fa-calendar"></i>
                  {plan.validity} Days
                </div>
              </div>
              
              <button 
                className="plan-btn-horizontal"
                onClick={() => handleRecharge(plan)}
                disabled={isProcessing || !isLoggedIn}
              >
                {isProcessing && selectedPlan?.id === plan.id ? (
                  <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : (
                  `Buy Now`
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="payment-section compact">
        <h2 className="section-title">Select Payment Method</h2>
        <div className="payment-methods compact">
          <label className="payment-method compact">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!isLoggedIn}
            />
            <i className="fab fa-google-pay"></i>
            <span>UPI</span>
          </label>
          
          <label className="payment-method compact">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!isLoggedIn}
            />
            <i className="fas fa-credit-card"></i>
            <span>Card</span>
          </label>
          
          <label className="payment-method compact">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!isLoggedIn}
            />
            <i className="fab fa-paypal"></i>
            <span>PayPal</span>
          </label>
        </div>
      </div>

      <div className="recharge-info compact">
        <h2 className="section-title">How Recharge Works</h2>
        <div className="info-steps compact">
          <div className="info-step compact">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Login</h4>
              <p>Sign in to your account</p>
            </div>
          </div>
          
          <div className="info-step compact">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Select Plan</h4>
              <p>Choose a credit package</p>
            </div>
          </div>
          
          <div className="info-step compact">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Pay</h4>
              <p>Complete payment</p>
            </div>
          </div>
          
          <div className="info-step compact">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Activate</h4>
              <p>Credits added instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;