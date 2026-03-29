import React from 'react';
import './Home.css';

const About = () => {
  return (
    <div className="home-page">
      <section className="features">
        <h2>About Snapsage Research</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontSize: '1.2rem', color: '#4b5563' }}>
          <p style={{ marginBottom: '1.5rem' }}>We are a team dedicated to revolutionizing how businesses capture feedback.</p>
          <p>Traditional surveys lack depth. They treat human emotions as boolean values. By letting users record quick videos alongside text, we empower researchers to decode genuine sentiment.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
