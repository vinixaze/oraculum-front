import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-text">Página não encontrada</p>
        <Link to="/">
          <Button variant="yellow" size="lg">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;