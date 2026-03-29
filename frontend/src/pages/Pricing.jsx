import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, Zap, ArrowRight } from 'lucide-react';
import './Pricing.css';

import api from '../services/api';
import toast from 'react-hot-toast';

const Pricing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [activating, setActivating] = useState(false);
  const [activatingPlanName, setActivatingPlanName] = useState('');

  // Fetch current purchase status if logged in
  useEffect(() => {
    if (!token) return;
    api.get('/purchase/status')
      .then(res => {
        if (res.data.hasPaidAccess) setCurrentPlan(res.data.purchasePlan);
      })
      .catch(() => {});
  }, [token]);

  const handleChoosePlan = async (plan) => {
    if (!token) {
      navigate('/login');
      return;
    }
    setActivating(true);
    setActivatingPlanName(plan);
    try {
      const res = await api.post('/purchase/activate', { plan });
      const data = res.data;
      if (data.hasPaidAccess) {
        toast.success(`${plan} Plan Activated!`);
        setCurrentPlan(data.purchasePlan);
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        stored.hasPaidAccess = true;
        stored.purchasePlan = data.purchasePlan;
        localStorage.setItem('user', JSON.stringify(stored));
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err) {
      toast.error('Failed to activate plan.');
      console.error('Plan activation error:', err);
    } finally {
      setActivating(false);
      setActivatingPlanName('');
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: '$49',
      period: '/mo',
      features: ['Up to 100 video responses', 'Review video upload', 'Basic analytics', 'Email support'],
    },
    {
      name: 'Professional',
      price: '$129',
      period: '/mo',
      popular: true,
      features: ['Up to 1,000 video responses', 'Advanced emotion AI', 'Priority support', 'Custom branding', 'Excel export'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Unlimited responses', 'Dedicated account manager', 'API access', 'SSO Integration'],
    },
  ];

  return (
    <div className="auth-page">
      <div className="mesh-gradient"></div>
      <div className="page-container" style={{ textAlign: 'center' }}>
        <h1>Transparent Pricing</h1>
        <p style={{ marginBottom: currentPlan ? '1rem' : '3rem', color: 'var(--text-sub)' }}>
          Plans that scale with your research needs.
        </p>

        {/* Active plan banner */}
        {currentPlan && (
          <div className="selection-banner">
            <Zap size={18} />
            <span>Active Plan: <span style={{color:'var(--text-main)'}}>{currentPlan}</span></span>
            <ArrowRight size={16} />
            <span
              onClick={() => navigate('/dashboard')}
              style={{ textDecoration: 'underline', cursor: 'pointer', color:'var(--text-main)' }}
            >
              Management Dashboard
            </span>
          </div>
        )}

        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.name} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}<span>{plan.period}</span></div>
              <ul>
                {plan.features.map(f => (
                  <li key={f}>
                    <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <button
                className={plan.popular ? 'btn-primary-pricing' : 'btn-outline-pricing'}
                onClick={() => handleChoosePlan(plan.name)}
                disabled={activating || currentPlan === plan.name}
                id={`pricing-btn-${plan.name.toLowerCase()}`}
              >
                {activating && activatingPlanName === plan.name
                  ? <><Loader size={18} className="rd-spin-inline" /> Validating...</>
                  : currentPlan === plan.name
                    ? '✓ Current Active Plan'
                    : `Initiate ${plan.name} License`
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
