import rechargePlansData from '../data/rechargePlans.json';

// Get all active recharge plans
export const getRechargePlans = () => {
  return rechargePlansData.plans.filter(plan => plan.isActive);
};

// Get plan by ID
export const getPlanById = (planId) => {
  return rechargePlansData.plans.find(plan => plan.id === planId && plan.isActive);
};

// Simulate API call to process payment
export const processPayment = async (planId, paymentMethod, userId) => {
  try {
    // This would be your actual API call to your backend
    const response = await fetch('/api/recharge/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        planId,
        paymentMethod,
        userId
      })
    });

    if (!response.ok) {
      throw new Error('Payment processing failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment error:', error);
    // For demo purposes, simulate success
    return { success: true, message: 'Payment processed successfully' };
  }
};

// Get user's current credits (would call your backend)
export const getUserCredits = async (userId) => {
  try {
    const response = await fetch(`/api/user/${userId}/credits`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user credits');
    }

    const data = await response.json();
    return data.credits;
  } catch (error) {
    console.error('Error fetching credits:', error);
    // Return a default value for demo purposes
    return 150;
  }
};