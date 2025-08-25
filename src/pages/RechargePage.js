import React, { useState, useEffect } from 'react';
import { getRechargePlans, processPayment, getUserCredits } from '../services/rechargeService';
import './RechargePage.css';

const RechargePage = ({ onNavigate }) => {
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
      setPlans(rechargePlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadUserCredits = async () => {
    try {
      // In a real app, you would get user ID from authentication context
      const credits = await getUserCredits('current-user');
      setUserCredits(credits);
    } catch (error) {
      console.error('Error loading credits:', error);
      setUserCredits(150); // Fallback value
    }
  };

  const handleRecharge = async (plan) => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan);

    try {
      // Process payment through your backend
      const paymentResult = await processPayment(
        plan.id,
        paymentMethod,
        'current-user' // Replace with actual user ID
      );

      if (paymentResult.success) {
        // Update user credits
        const updatedCredits = await getUserCredits('current-user');
        setUserCredits(updatedCredits);
        
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
      </div>

      <div className="recharge-plans">
        <h2 className="section-title">Available Plans</h2>
        <div className="plans-grid">
          {plans.map(plan => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            >
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
              </div>
              
              <div className="credits-badge">
                <i className="fas fa-coins"></i>
                {plan.credits} Credits
              </div>
              
              <div className="validity">Valid for {plan.validity} days</div>
              
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className="plan-btn"
                onClick={() => handleRecharge(plan)}
                disabled={isProcessing}
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

      <div className="payment-section">
        <h2 className="section-title">Select Payment Method</h2>
        <div className="payment-methods">
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <i className="fab fa-google-pay"></i>
            <span>UPI / Google Pay</span>
          </label>
          
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <i className="fas fa-credit-card"></i>
            <span>Credit/Debit Card</span>
          </label>
          
          <label className="payment-method">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <i className="fab fa-paypal"></i>
            <span>PayPal</span>
          </label>
        </div>
      </div>

      <div className="recharge-info">
        <h2 className="section-title">How Recharge Works</h2>
        <div className="info-steps">
          <div className="info-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Select a Plan</h4>
              <p>Choose from our affordable credit packages</p>
            </div>
          </div>
          
          <div className="info-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Make Payment</h4>
              <p>Complete the payment using your preferred method</p>
            </div>
          </div>
          
          <div className="info-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Instant Activation</h4>
              <p>Credits are added to your account immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;