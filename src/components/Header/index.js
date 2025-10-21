import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-text">ORACULUM</span>
        </div>
        <a href="#" className="header-link">
          PORTAL DO GESTOR
        </a>
      </div>
    </header>
  );
}

export default Header;