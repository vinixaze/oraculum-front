import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/OraculumLogo.png';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* CORREÇÃO: A logo e seu container estão dentro do <Link to="/"> */}
        <Link to="/" className="header-logo-link">
          <div className="header-logo">
            <img src={logo} alt="Logo Oraculum" className="logo-img" />
          </div>
        </Link>
        
        {/* O link PORTAL DO GESTOR continua sendo um link separado */}
        <a href="#" className="header-link">
          PORTAL DO GESTOR
        </a>
      </div>
    </header>
  );
}

export default Header;