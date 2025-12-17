import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  if (!property || !property._id) {
    return null;
  }

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    if (property.listingType === 'rent') {
      return `₹${price.toLocaleString('en-IN')}/month`;
    }
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <div className="property-image">
        <img 
          src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'} 
          alt={property.title || 'Property'} 
        />
        <span className={`badge ${property.listingType || 'sale'}`}>
          For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
        </span>
      </div>
      <div className="property-content">
        <h3>{property.title || 'Untitled Property'}</h3>
        <p className="property-location">
          <FaMapMarkerAlt /> {property.address?.city || 'N/A'}, {property.address?.state || 'N/A'}
        </p>
        <p className="property-price">{formatPrice(property.price)}</p>
        <div className="property-features">
          <span><FaBed /> {property.bedrooms || 0} Beds</span>
          <span><FaBath /> {property.bathrooms || 0} Baths</span>
          <span><FaRulerCombined /> {property.area || 0} sqft</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
