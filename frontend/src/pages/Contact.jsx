import React, { useState } from 'react';
import api from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phoneNumber: '',
    serviceInterest: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact', formData);
      setStatus({ type: 'success', message: 'Thank you! Your inquiry has been sent.' });
      setFormData({
        firstName: '', lastName: '', email: '', company: '', 
        phoneNumber: '', serviceInterest: '', message: ''
      });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to send inquiry. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page page-container animate-slide-up">
      <div className="contact-header">
        <h1 className="gradient-text">Contact Our Research Team</h1>
        <p>Drop us a line and let's discuss how video insights can elevate your business.</p>
      </div>

      <div className="form-container glass-card">
        {status.message && (
          <div className={`alert alert-${status.type} animate-slide-up`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name*</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div className="form-group">
              <label>Last Name*</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address*</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Company/Organization</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="(555) 000-0000" />
            </div>
            <div className="form-group">
              <label>Service of Interest</label>
              <select name="serviceInterest" value={formData.serviceInterest} onChange={handleChange}>
                <option value="">-- Select a Service --</option>
                <option value="Consumer Insights">Consumer Insights</option>
                <option value="B2B Consultation">B2B Consultation</option>
                <option value="Brand Perception">Brand Perception</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Message*</label>
            <textarea name="message" rows="5" required value={formData.message} onChange={handleChange} placeholder="How can we help you today?"></textarea>
          </div>

          <button type="submit" className="btn-wow btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
