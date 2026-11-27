import React from 'react';

export default function Header({
  title = "EduFeeback",
  subtitle = "Provide your valuable feedback to help elevate educational excellence",
  college = "ABESEC Ghaziabad",
  className = ""
}) {
  return (
    <header className={`text-center mb-6 max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-lg shadow-indigo-500/25">
        <i className="fa-solid fa-graduation-cap"></i>
      </div>
      <div className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
        {college}
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-1.5 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </header>
  );
}
