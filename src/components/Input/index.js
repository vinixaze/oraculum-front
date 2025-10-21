import React from 'react';
import './Input.css';

function Input({ 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  className = '',
  icon = null
}) {
  return (
    <div className="input-wrapper">
      {icon && (
        <div className="input-icon">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input ${icon ? 'input-with-icon' : ''} ${className}`}
      />
    </div>
  );
}

export default Input;