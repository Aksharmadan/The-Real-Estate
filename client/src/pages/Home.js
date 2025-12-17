import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Dream Property</h1>
        <p>Discover the perfect home with virtual tours and smart search</p>
        <Link to="/properties" className="cta-button">Explore Properties</Link>
      </div>
      <div className="features">
        <div className="feature-card">
          <h3>🏠 Wide Selection</h3>
          <p>Browse thousands of properties</p>
        </div>
        <div className="feature-card">
          <h3>🎥 Virtual Tours</h3>
          <p>360° panoramic views</p>
        </div>
        <div className="feature-card">
          <h3>💰 EMI Calculator</h3>
          <p>Plan your finances easily</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
