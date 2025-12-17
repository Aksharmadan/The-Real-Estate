import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import { toast } from 'react-toastify';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/properties');
      if (data.success && data.data) {
        setProperties(data.data);
      } else {
        setProperties([]);
        setError('No properties found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again.');
      setProperties([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const { data } = await API.get(`/properties?${params.toString()}`);
      setProperties(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error applying filters:', error);
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
    });
    fetchProperties();
  };

  if (loading) {
    return (
      <div className="properties-page">
        <div className="loading-container">
          <div className="loading">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="properties-page">
        <div className="error-container">
          <h2>Error Loading Properties</h2>
          <p>{error}</p>
          <button onClick={fetchProperties} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <div className="filters-section">
        <h2>Find Your Perfect Property</h2>
        <div className="filters">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
          </select>
          <select name="listingType" value={filters.listingType} onChange={handleFilterChange}>
            <option value="">Listing Type</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
            <option value="">Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          <button onClick={applyFilters} className="filter-btn">Apply Filters</button>
          <button onClick={resetFilters} className="reset-btn">Reset</button>
        </div>
      </div>

      <div className="properties-grid">
        {properties.length === 0 ? (
          <div className="no-properties">
            <h3>No properties found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            <div className="properties-count">
              Showing {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
            </div>
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
