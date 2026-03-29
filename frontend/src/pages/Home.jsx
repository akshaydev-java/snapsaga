import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Brain, Shield, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Dynamic Background Mesh */}
      <div className="mesh-gradient"></div>
      
      <section className="hero">
        <div className="hero-content animate-slide-up">
          <div className="badge-premium animate-float">
            <span>Powered by Emotional Analytics</span>
          </div>
          <h1 className="outfit">Professional <span className="gradient-text-vibrant">Video Research</span> for Modern Brands</h1>
          <p className="hero-description">Experience the next generation of feedback. Capture authentic human emotions through video surveys and extract deep AI-driven sentiment insights in seconds.</p>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn-wow-premium">
              Build Your First Survey <ArrowRight size={20} style={{marginLeft: '0.8rem'}} />
            </Link>
            <Link to="/services" className="btn-glass">
              View AI Capabilities
            </Link>
          </div>

          {/* Hero Visual: The Terminal Tray */}
          <div className="hero-visual-container animate-fade-in-up">
              <div className="glass-tray">
                  <div className="tray-header">
                      <div className="tray-dots"><span></span><span></span><span></span></div>
                      <div className="tray-title text-muted">snapsage_engine_v2.0</div>
                  </div>
                  <div className="tray-content">
                      <div className="mock-video-preview">
                          <div className="pulse-dot"></div>
                          <div className="video-overlay-data">
                              <span className="analysis-tag">Analyzing Sentiment...</span>
                              <div className="sentiment-meter">
                                  <div className="sentiment-fill" style={{width: '78%'}}></div>
                              </div>
                              <span className="sentiment-value">94% Positive Accuracy</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>

      <section className="features-v2">
        <div className="container">
          <div className="section-header">
            <h2 className="outfit animate-slide-up">Engineered for <span className="gradient-text">Clarity</span></h2>
            <p className="text-muted">Turn qualitative video responses into quantitative intelligence.</p>
          </div>
          
          <div className="feature-grid-v2">
            <div className="feature-card-premium glass-card animate-slide-up">
              <div className="card-glow"></div>
              <div className="icon-box">
                <Video size={32} />
              </div>
              <h3>Video Intelligence</h3>
              <p>Beyond transcripts. Our AI detects tonal shifts, micro-expressions, and contextual sentiment that text surveys ignore.</p>
              <div className="card-link">Explore Technology →</div>
            </div>

            <div className="feature-card-premium glass-card animate-slide-up" style={{animationDelay: '0.15s'}}>
              <div className="card-glow"></div>
              <div className="icon-box">
                <Brain size={32} />
              </div>
              <h3>Automated Synthesis</h3>
              <p>Save weeks of manual research. Get instant summaries, keyword clouds, and rating distributions from hundreds of videos.</p>
              <div className="card-link">View Analytics →</div>
            </div>

            <div className="feature-card-premium glass-card animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="card-glow"></div>
              <div className="icon-box">
                <Shield size={32} />
              </div>
              <h3>Enterprise Security</h3>
              <p>SOC2-ready protocols with end-to-end encryption for all video data. Your participant privacy is our primary directive.</p>
              <div className="card-link">Trust Center →</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
