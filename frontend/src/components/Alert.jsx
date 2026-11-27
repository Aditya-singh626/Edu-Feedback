import React from 'react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styleMap = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-500',
    error: 'bg-rose-50 text-rose-800 border-rose-500',
    info: 'bg-indigo-50 text-indigo-800 border-indigo-500',
  };

  const alertStyles = styleMap[type] || styleMap.info;

  return (
    <div className={`flex items-center justify-between p-3.5 rounded-lg text-sm mb-5 border-l-4 ${alertStyles}`}>
      <div className="flex items-center gap-2.5">
        <span className="font-bold text-base">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="text-lg cursor-pointer opacity-60 hover:opacity-100 transition px-1 leading-none"
          onClick={onClose}
        >
          &times;
        </button>
      )}
    </div>
  );
}
