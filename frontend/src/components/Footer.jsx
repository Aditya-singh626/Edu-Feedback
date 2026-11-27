import React from 'react';

export default function Footer({ className = "" }) {
  return (
    <footer className={`text-center text-xs text-slate-500 space-y-1 ${className}`}>
      <p className="font-semibold text-slate-700">
        Developed &amp; Maintained By: Akshat Rastogi, Aditya Singh (CSE 11)
      </p>
      <p className="text-slate-500">Full Stack Development Team</p>
      <p className="text-slate-400">&copy; 2026 ABESEC Ghaziabad. All Rights Reserved.</p>
    </footer>
  );
}
