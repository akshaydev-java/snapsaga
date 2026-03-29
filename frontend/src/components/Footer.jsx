import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-section">
          <h3>Snapsage</h3>
          <p>The premium video-insight platform that captures the real "why" behind every response.</p>
        </div>
        <div className="footer-section">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/about">Our Vision</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Sales</Link></li>
            <li><Link to="/contact">Help Center</Link></li>
            <li><Link to="/login">Admin Login</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <p>hello@snapsage.com</p>
          <p>San Francisco, CA</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Snapsage Research. Built for the future of feedback.</p>
      </div>
    </footer>
  );
};

export default Footer;
