import "../css/components/navbar.css";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Logo from "/logo.png";
import { Icon } from "@iconify/react";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);

  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 50) {
        // Scrolling down
        setShowTopbar(false);
        setScrolledDown(true);
      } else {
        // Scrolling up
        setShowTopbar(true);
        setScrolledDown(false);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const closeMenu = () => setMenuOpen(false);


  return (
    <>
      <div className={`topbar ${showTopbar ? 'show' : 'hide'}`}>
        <div className="topbar-container">
          <span><Icon icon="tabler:clock" width="24" height="24" /> Lun - Sab 8:00 a 18:00. Domingo - CERRADO</span>
          <div className="topbar-right">
            <span><Icon icon="tabler:phone" width="24" height="24" /> +54 1127706352</span>
            <span><Icon icon="uiw:mail-o" width="20" height="20" /> consultorio@sanmarcos.com</span>
            <span><Icon icon="tabler:map" width="24" height="24" /> Rivera 146, Villa Madero, CABA</span>
          </div>
        </div>
      </div>

      <nav className={`navbar ${scrolledDown ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <img src={Logo} alt="Logo" className="navbar-logo" />
          <div className="hamburger" onClick={() => setMenuOpen(true)}>☰</div>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <div className="close-btn" onClick={closeMenu}>✕</div>
            <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/services" onClick={closeMenu}>Especialidades</Link></li>
            <li><Link to="/about" onClick={closeMenu}>Nosotros</Link></li>
            <li><Link to="/blog" onClick={closeMenu}>Blogs</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
