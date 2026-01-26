"use client";

import React from 'react';

interface FancyButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'emerald' | 'blue';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const FancyButton = ({ 
  children, 
  icon,
  onClick, 
  href,
  variant = 'emerald',
  className = "",
  type = 'button',
  disabled = false
}: FancyButtonProps) => {
  const variantClass = variant === 'blue' ? 'btn-fancy-blue' : '';
  
  const content = (
    <>
      <span className="btn-ball">
        {icon || (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </span>
      <span className="relative z-10 font-medium">{children}</span>
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        className={`btn-fancy ${variantClass} ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-fancy ${variantClass} ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {content}
    </button>
  );
};

// Plus icon for New Challenge
export const PlusIconButton = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Wallet icon for Payout
export const WalletIconButton = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

// Credit card icon for Payment
export const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
