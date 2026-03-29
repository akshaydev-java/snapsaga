import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error("Could not fetch services", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="services-header">
        <h1>Our Research Solutions</h1>
        <p>Comprehensive video-based methodologies tailored to uncover actionable insights.</p>
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading services...</div>
      ) : (
        <div className="services-grid">
          {services.length > 0 ? (
            services.map((svc) => (
              <div key={svc.id} className="service-card">
                <div className="service-icon">📊</div>
                <h3>{svc.title}</h3>
                <p>{svc.description}</p>
              </div>
            ))
          ) : (
            <div className="service-card">
              <h3>Video Feedback Collection</h3>
              <p>Turn text comments into rich, emotional video insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
