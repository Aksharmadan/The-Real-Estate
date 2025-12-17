import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaRegHeart, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import VirtualTour from '../components/VirtualTour';
import EMICalculator from '../components/EMICalculator';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    message: '',
    phone: '',
  });

  const fetchProperty = useCallback(async () => {
    try {
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/properties');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleSaveProperty = async () => {
    if (!user) {
      toast.error('Please login to save properties');
      navigate('/login');
      return;
    }
    try {
      await API.put(`/users/save-property/${id}`);
      setSaved(!saved);
      toast.success(saved ? 'Property removed from saved' : 'Property saved!');
    } catch (error) {
      toast.error('Error saving property');
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to contact owner');
      navigate('/login');
      return;
    }
    try {
      await API.post('/inquiries', {
        property: id,
        message: inquiryData.message,
        phone: inquiryData.phone,
      });
      toast.success('Inquiry sent successfully!');
      setShowInquiryForm(false);
      setInquiryData({ message: '', phone: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error sending inquiry');
    }
  };

  const formatPrice = (price) => {
    if (property.listingType === 'rent') {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  };

  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }

  return (
    <div className="property-details">
      <div className="property-header">
        <div className="property-title-section">
          <h1>{property.title}</h1>
          <p className="property-location">
            <FaMapMarkerAlt /> {property.address.street}, {property.address.city}, {property.address.state} - {property.address.zipCode}
          </p>
        </div>
        <div className="property-actions">
          <div className="property-price">{formatPrice(property.price)}</div>
          <button onClick={handleSaveProperty} className="save-btn">
            {saved ? <FaHeart /> : <FaRegHeart />} {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="property-images">
        <div className="main-image">
          <img src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} alt={property.title} />
        </div>
        {property.images && property.images.length > 1 && (
          <div className="thumbnail-images">
            {property.images.slice(1, 4).map((img, index) => (
              <img key={index} src={img.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} alt={`Property ${index + 2}`} />
            ))}
          </div>
        )}
      </div>

      <div className="tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        {property.panoramicImages && property.panoramicImages.length > 0 && (
          <button className={activeTab === 'virtual-tour' ? 'active' : ''} onClick={() => setActiveTab('virtual-tour')}>
            Virtual Tour
          </button>
        )}
        {property.listingType === 'sale' && (
          <button className={activeTab === 'emi-calculator' ? 'active' : ''} onClick={() => setActiveTab('emi-calculator')}>
            EMI Calculator
          </button>
        )}
      </div>

      <div className="property-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="property-info">
              <h2>Property Details</h2>
              <div className="property-features-grid">
                <div className="feature-item">
                  <FaBed className="feature-icon" />
                  <div>
                    <p className="feature-label">Bedrooms</p>
                    <p className="feature-value">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaBath className="feature-icon" />
                  <div>
                    <p className="feature-label">Bathrooms</p>
                    <p className="feature-value">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaRulerCombined className="feature-icon" />
                  <div>
                    <p className="feature-label">Area</p>
                    <p className="feature-value">{property.area} sqft</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaStar className="feature-icon" />
                  <div>
                    <p className="feature-label">Type</p>
                    <p className="feature-value">{property.propertyType}</p>
                  </div>
                </div>
              </div>

              <h2>Description</h2>
              <p className="property-description">{property.description}</p>

              {property.amenities && property.amenities.length > 0 && (
                <>
                  <h2>Amenities</h2>
                  <div className="amenities-list">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="owner-card">
              <h3>Contact Owner</h3>
              <div className="owner-info">
                <h4>{property.owner.name}</h4>
                <p><FaPhone /> {property.owner.phone}</p>
                <p><FaEnvelope /> {property.owner.email}</p>
              </div>
              {!showInquiryForm ? (
                <button onClick={() => setShowInquiryForm(true)} className="contact-btn">
                  Send Inquiry
                </button>
              ) : (
                <form onSubmit={handleInquiry} className="inquiry-form">
                  <textarea
                    placeholder="Your message..."
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    required
                  />
                  <button type="submit" className="submit-btn">Send</button>
                  <button type="button" onClick={() => setShowInquiryForm(false)} className="cancel-btn">Cancel</button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'virtual-tour' && (
          <VirtualTour panoramicImages={property.panoramicImages} />
        )}

        {activeTab === 'emi-calculator' && (
          <EMICalculator propertyPrice={property.price} />
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
