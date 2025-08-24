// pages/RechargePage.js
import React from 'react';

const RechargePage = ({ onRecharge, onNavigate }) => {
  const rechargePlans = [
    {
      id: 1,
      name: "1 Day Plan",
      price: 99,
      credits: 1000,
      features: ["Chat for 1 Day", "Selfies: 5", "Valid for All Characters"]
    },
    {
      id: 2,
      name: "7 Days Plan",
      price: 399,
      credits: 15000,
      features: ["Chat for 7 Days", "Selfies: 20", "Valid for All Characters", "50% OFF"]
    },
    {
      id: 3,
      name: "30 Days Plan",
      price: 999,
      credits: 30000,
      features: ["Chat for 30 Days", "Selfies: 50", "Valid for All Characters", "50% OFF"]
    }
  ];

  const handleRecharge = (plan) => {
    onRecharge(plan.credits);
  };

  return (
    <div className="recharge-page">
      <div className="recharge-header">
        <h1 className="recharge-title">Recharge Plans</h1>
        <p>Choose a plan that suits you best</p>
      </div>
      
      <div className="recharge-plans">
        {rechargePlans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price">₹{plan.price}</div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="plan-btn"
              onClick={() => handleRecharge(plan)}
            >
              Add @ ₹{plan.price}
            </button>
          </div>
        ))}
      </div>
      
      <div className="recharge-footer">
        <p>Reach out to support@airoleplay.me in case of any issues</p>
      </div>
    </div>
  );
};

export default RechargePage;