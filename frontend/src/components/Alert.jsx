import React from 'react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`message-alert message-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className="alert-text">{message}</span>
      </div>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
}
