import React from 'react';
import './Header.css';
import logo from '../../assets/OraculumLogo.png'; // ajuste o caminho conforme sua estrutura

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="Logo Oraculum" className="logo-img" />
        </div>
        <a href="#" className="header-link">
          PORTAL DO GESTOR
        </a>
      </div>
    </header>
  );
}

export default Header;
