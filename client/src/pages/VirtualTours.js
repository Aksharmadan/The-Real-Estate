import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import VirtualTourViewer from '../components/VirtualTourViewer';
import './VirtualTours.css';

const VirtualTours = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchPropertiesWithTours();
  }, []);

  const [error, setError] = useState(null);

  const fetchPropertiesWithTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/properties');
      if (data.success && data.data) {
        // Filter properties that have virtual tours
        const propertiesWithTours = data.data.filter(
          property => property.panoramicImages && property.panoramicImages.length > 0
        );
        setProperties(propertiesWithTours);
        if (propertiesWithTours.length > 0) {
          setSelectedProperty(propertiesWithTours[0]);
        }
      } else {
        setProperties([]);
        setError('No properties data received');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load virtual tours. Please try again.');
      setProperties([]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="virtual-tours-page">
        <div className="loading-container">
          <div className="loading">Loading virtual tours...</div>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="virtual-tours-page">
        <div className="error-container">
          <h2>Error Loading Virtual Tours</h2>
          <p>{error}</p>
          <button onClick={fetchPropertiesWithTours} className="retry-btn">Retry</button>
          <Link to="/properties" className="cta-button">Browse All Properties</Link>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="virtual-tours-page">
        <div className="no-tours">
          <h2>No Virtual Tours Available</h2>
          <p>There are currently no properties with virtual tours.</p>
          <Link to="/properties" className="cta-button">Browse All Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="virtual-tours-page">
      <div className="virtual-tours-header">
        <h1>360° Virtual Tours</h1>
        <p>Explore properties with immersive virtual tours</p>
      </div>

      <div className="virtual-tours-content">
        <div className="tours-list">
          <h2>Properties with Virtual Tours ({properties.length})</h2>
          <div className="properties-grid">
            {properties.map(property => (
              <div
                key={property._id}
                className={`property-item ${selectedProperty?._id === property._id ? 'active' : ''}`}
                onClick={() => setSelectedProperty(property)}
              >
                <img
                  src={property.images?.[0]?.url || 'https://via.placeholder.com/300x200'}
                  alt={property.title}
                />
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="property-location">{property.address?.city}, {property.address?.state}</p>
                  <p className="property-price">
                    {property.listingType === 'rent'
                      ? `₹${property.price?.toLocaleString()}/month`
                      : `₹${(property.price / 100000)?.toFixed(2)} Lakhs`}
                  </p>
                  <span className="tour-count">
                    {property.panoramicImages?.length || 0} tour{property.panoramicImages?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProperty && (
          <div className="tour-viewer-section">
            <div className="tour-viewer-header">
              <h2>{selectedProperty.title}</h2>
              <Link to={`/properties/${selectedProperty._id}`} className="view-details-btn">
                View Full Details
              </Link>
            </div>
            <VirtualTourViewer property={selectedProperty} />
          </div>
        )}
      </div>
    </div>
  );
};


export default VirtualTours;
