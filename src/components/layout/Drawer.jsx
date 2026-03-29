import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaPalette, FaImages, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import './Drawer.css';

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change for mobile
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="drawer-toggle" onClick={toggleDrawer} aria-label="Toggle menu">
        <FaBars />
      </button>

      {isOpen && <div className="drawer-overlay" onClick={() => setIsOpen(false)} />}

      <nav className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Link to="/" className="drawer-brand">
            <FaPalette className="brand-icon" /> <span className="brand-text">Pixel Art</span>
          </Link>
          <button className="drawer-close" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        
        <div className="drawer-links">
          <NavLink to="/" className={({isActive}) => isActive ? "drawer-link active" : "drawer-link"}>
            <FaHome /> <span>Home</span>
          </NavLink>
          <NavLink to="/editor" className={({isActive}) => isActive ? "drawer-link active" : "drawer-link"}>
            <FaPalette /> <span>Editor</span>
          </NavLink>
          <NavLink to="/gallery" className={({isActive}) => isActive ? "drawer-link active" : "drawer-link"}>
            <FaImages /> <span>Gallery</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Drawer;
