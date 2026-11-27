import React, { useState } from 'react';
import { loginUser } from '../utils/storage';
import { DEMO_QUICK_ACCOUNTS, DEMO_USERS } from '../utils/mockData';
import Alert from '../components/Alert';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login({ onLoginSuccess }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginUserType, setLoginUserType] = useState('student');

  const handleQuickLogin = (account) => {
    setLoginEmail(account.email);
    setLoginPassword(account.password);
    setLoginUserType(account.userType);
    setMessage({
      type: 'info',
      text: `Demo account selected (${account.label || account.name}). Click "Sign In" to continue.`
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!loginEmail || !loginPassword) {
      setMessage({ type: 'error', text: 'Please fill in both email and password.' });
      return;
    }

    setLoading(true);
    const result = await loginUser(loginEmail, loginPassword, loginUserType);
    setLoading(false);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setMessage({
        type: 'error',
        text: result.message || 'Invalid credentials. Please select or enter a valid demo account.'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50">
      <Header />

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8">
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2.5">
                <i className="fa-solid fa-bolt text-amber-500"></i>
                <strong>Quick Login with Demo Accounts:</strong>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {DEMO_QUICK_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white rounded-md px-2.5 py-1 text-xs font-medium text-slate-700 transition shadow-sm cursor-pointer"
                    onClick={() => handleQuickLogin(acc)}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1 text-xs text-slate-500">
                <label htmlFor="all-demo-select">Or choose any demo account:</label>
                <select
                  id="all-demo-select"
                  className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => {
                    const found = DEMO_USERS.find(u => u.email === e.target.value);
                    if (found) handleQuickLogin(found);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Select demo user --</option>
                  {DEMO_USERS.map((u) => (
                    <option key={u.email} value={u.email}>
                      [{u.userType.toUpperCase()}] {u.name} ({u.department || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <i className="fa-regular fa-envelope absolute left-3.5 text-slate-400 text-sm pointer-events-none"></i>
                <input
                  id="login-email"
                  type="email"
                  placeholder="e.g. alice.johnson@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <i className="fa-solid fa-lock absolute left-3.5 text-slate-400 text-sm pointer-events-none"></i>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-slate-700 mb-1.5">
                I am logging in as:
              </label>
              <select
                id="user-type"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                value={loginUserType}
                onChange={(e) => setLoginUserType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-sm hover:shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <Footer className="mt-8" />
    </div>
  );
}
