import React from 'react';
import './Button.css';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'yellow',
  size = 'default',
  className = '',
  disabled = false 
}) {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={buttonClass}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;