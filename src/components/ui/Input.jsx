import React from 'react';
import './Input.css';

const Input = ({ label, id, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`input-container ${containerClassName}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input 
        id={id}
        className={`input-field ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
