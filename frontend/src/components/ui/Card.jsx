import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`glass-card p-6 ${hover ? 'hover:border-white/20' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
