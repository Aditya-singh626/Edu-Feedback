import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/storage';
import { DEMO_QUICK_ACCOUNTS, DEMO_USERS } from '../utils/mockData';
import Alert from '../components/Alert';

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginUserType, setLoginUserType] = useState('student');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUserType, setRegUserType] = useState('student');
  const [regDepartment, setRegDepartment] = useState('');

  const handleQuickLogin = (account) => {
    setLoginEmail(account.email);
    setLoginPassword(account.password);
    setLoginUserType(account.userType);
    setMessage({
      type: 'info',
      text: `Demo account selected (${account.label || account.name}). Click "Login" to continue.`
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
        text: result.message || 'Invalid credentials. Try a demo account or register a new one.'
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!regName || !regEmail || !regPassword) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    const result = await registerUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      userType: regUserType,
      department: regDepartment
    });
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Clear registration form and switch to login
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
      setLoginUserType(regUserType);
      setActiveTab('login');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegDepartment('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-header">
        <div className="brand-icon-large">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <h1>Faculty Feedback System</h1>
        <p>Provide your valuable feedback to help elevate educational excellence</p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setMessage(null);
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setMessage(null);
            }}
          >
            Register
          </button>
        </div>

        <div className="auth-body">
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="demo-accounts-box">
                <div className="demo-header">
                  <i className="fa-solid fa-bolt"></i>
                  <strong>Quick Login with Demo Accounts:</strong>
                </div>
                <div className="demo-pills">
                  {DEMO_QUICK_ACCOUNTS.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="demo-pill-btn"
                      onClick={() => handleQuickLogin(acc)}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
                <div className="demo-select-row">
                  <label htmlFor="all-demo-select">Or choose any demo account:</label>
                  <select
                    id="all-demo-select"
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

              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="e.g. alice.johnson@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="user-type">I am logging in as:</label>
                <select
                  id="user-type"
                  value={loginUserType}
                  onChange={(e) => setLoginUserType(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-user"></i>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Enter full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <div className="input-with-icon">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="Enter institutional email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-type">Register As:</label>
                <select
                  id="reg-type"
                  value={regUserType}
                  onChange={(e) => setRegUserType(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reg-dept">Department</label>
                <input
                  id="reg-dept"
                  type="text"
                  placeholder="e.g. Computer Science, Mathematics"
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="auth-footer">
        <p>&copy; {new Date().getFullYear()} Faculty Feedback System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
