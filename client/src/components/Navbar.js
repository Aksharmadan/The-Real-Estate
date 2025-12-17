import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaBuilding, FaUser, FaSignOutAlt, FaSignInAlt, FaVideo } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaBuilding /> RealEstate
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><Link to="/properties">Properties</Link></li>
          <li><Link to="/virtual-tours"><FaVideo /> Virtual Tours</Link></li>
          {user ? (
            <>
              {(user.role === 'agent' || user.role === 'admin') && (
                <li><Link to="/add-property">Add Property</Link></li>
              )}
              <li className="user-info"><FaUser /> {user.name}</li>
              <li><button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login"><FaSignInAlt /> Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
