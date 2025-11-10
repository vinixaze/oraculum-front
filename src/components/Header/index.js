import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/OraculumLogo.png';

function Header() {
  const navigate = useNavigate();

  const handleManagerPortal = (e) => {
    e.preventDefault();
    navigate('/manager/dashboard');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo-link">
          <div className="header-logo">
            <img src={logo} alt="Logo Oraculum" className="logo-img" />
          </div>
        </Link>
        
        <a href="#" className="header-link" onClick={handleManagerPortal}>
          PORTAL DO GESTOR
        </a>
      </div>
    </header>
  );
}

export default Header;
