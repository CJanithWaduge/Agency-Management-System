import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import CyberBackground from '../components/CyberBackground';

const Auth = ({ onAuthenticated, profileImage }) => {
  const [isRegistering, setIsRegistering] = useState(() => {
    // Check if registration is being forced from Settings
    const forced = sessionStorage.getItem('samindu_force_register') === 'true';
    if (forced) {
      sessionStorage.removeItem('samindu_force_register');
      return true;
    }
    // Otherwise show registration only if no users are registered yet
    const users = JSON.parse(localStorage.getItem('samindu_users') || '[]');
    return users.length === 0;
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('samindu_current_user') || null
  );


  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);



  // Check if any user is registered
  const isUserRegistered = () => {
    const users = JSON.parse(localStorage.getItem('samindu_users') || '[]');
    return users.length > 0;
  };

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // Verify terms are agreed
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    // Verify all fields are filled
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Username and password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    // All checks passed - Store credentials
    const users = JSON.parse(localStorage.getItem('samindu_users') || '[]');

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      setError('Username already exists.');
      return;
    }

    users.push({ username, password });
    localStorage.setItem('samindu_users', JSON.stringify(users));
    localStorage.setItem('samindu_current_user', username);

    onAuthenticated(username);
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('🔑 LOGIN ATTEMPT:', { currentUser, username, passwordLength: password.length });
    setError('');

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('samindu_users') || '[]');
    const targetUsername = currentUser || username;
    const user = users.find(u => u.username === targetUsername);

    if (!user) {
      console.error('❌ LOGIN FAILED: User not found', targetUsername);
      setError('User not found.');
      return;
    }

    if (password !== user.password) {
      console.error('❌ LOGIN FAILED: Incorrect password for', targetUsername);
      setError('Incorrect password.');
      return;
    }

    console.log('✅ LOGIN SUCCESS for:', user.username);
    localStorage.setItem('samindu_current_user', user.username);
    onAuthenticated(user.username);
  };

  // Handle "Sign in as different user"
  const handleSignInAsOther = () => {
    setCurrentUser(null);
    setPassword('');
    setUsername('');
    setError('');
    setIsRegistering(false);
  };

  // Handle "Create New Account"
  const handleCreateNewAccount = () => {
    setCurrentUser(null);
    setPassword('');
    setUsername('');
    setError('');
    setIsRegistering(true);
  };

  const usersList = JSON.parse(localStorage.getItem('samindu_users') || '[]');
  console.log('🔄 Auth Component State:', { isRegistering, currentUser, usersCount: usersList.length });

  // If we have users but none selected, show the profile selector
  if (!isRegistering && !currentUser && usersList.length > 0) {
    return (
      <div className="auth-container">
        <CyberBackground />
        <div className="auth-background" style={{ background: 'transparent' }}></div>

        <div className="auth-card" style={{ maxWidth: '500px' }}>
          <h1 className="auth-title">Who's logging in?</h1>
          <div className="profile-selection-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '20px',
            width: '100%',
            marginTop: '20px'
          }}>
            {usersList.map((user) => (
              <button
                key={user.username}
                onClick={() => {
                  // Check if we require password
                  const requirePassword = localStorage.getItem('samindu_require_password') !== 'false';

                  if (!requirePassword) {
                    // Quick Login Bypass
                    console.log('⚡ QUICK LOGIN for:', user.username);
                    localStorage.setItem('samindu_current_user', user.username);
                    onAuthenticated(user.username);
                  } else {
                    // Standard Login
                    setCurrentUser(user.username);
                  }
                }}
                className="profile-select-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '15px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--accent-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{user.username}</span>
              </button>
            ))}
          </div>

          <div className="auth-footer-links" style={{ marginTop: '30px' }}>
            <div className="auth-toggle">
              Missing your account? <button
                type="button"
                onClick={handleCreateNewAccount}
                className="auth-toggle-link"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is registered and currentUser exists, show password-only login
  if (isUserRegistered() && currentUser) {
    return (
      <div className="auth-container">
        <CyberBackground />
        <div className="auth-background" style={{ background: 'transparent' }}></div>

        <div className="auth-card">
          <div className="auth-profile-picture">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="auth-profile-img" />
            ) : (
              <div className="auth-profile-placeholder">👤</div>
            )}
          </div>

          <h2 className="auth-username" style={{ color: 'white', marginBottom: '10px' }}>{currentUser}</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '25px', fontWeight: '400' }}>
            Verify your identity to continue
          </p>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                autoFocus
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="auth-button" style={{ flex: 1 }}>
                <LogIn size={16} /> Sign In
              </button>
            </div>
          </form>

          <div className="auth-footer-links">
            <button
              onClick={handleSignInAsOther}
              className="auth-switch-user-link"
            >
              Sign in as different user
            </button>
            <div className="auth-toggle">
              Don't have an account? <button
                type="button"
                onClick={handleCreateNewAccount}
                className="auth-toggle-link"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not registered or user switched, show registration/login form
  return (
    <div className="auth-container">
      <CyberBackground />
      <div className="auth-background" style={{ background: 'transparent' }}></div>

      <div className="auth-card">
        <div className="auth-profile-picture">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="auth-profile-img" />
          ) : (
            <div className="auth-profile-placeholder">👤</div>
          )}
        </div>

        <h1 className="auth-title">
          {isRegistering ? 'Create Account' : 'Welcome to W2 Tech'}
        </h1>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="auth-form">
          {(!currentUser || isRegistering) && (
            <div className="auth-input-group">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                autoFocus={!isRegistering}
              />
            </div>
          )}

          {/* License Key Input - REMOVED: Now handled in LicenseEULAScreen */}

          <div className="auth-input-group">
            <Lock size={18} className="auth-input-icon" />
            <input
              type="password"
              placeholder={isRegistering ? 'Create a password' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          {isRegistering && (
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          )}


          {isRegistering && (
            <div className="auth-terms-container">
              <div className="auth-terms-checkbox">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="auth-checkbox"
                />
                <label htmlFor="terms-checkbox" className="auth-checkbox-label">
                  I agree to the Terms and Conditions
                </label>
              </div>
              <button
                type="button"
                className="auth-see-terms-btn"
                onClick={() => setShowTermsModal(true)}
              >
                See
              </button>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          {/* TRIPLE LOCK BUTTON - Disabled until terms agreed and fields filled */}
          <button
            type="submit"
            className="auth-button"
            disabled={
              isRegistering && (
                !agreedToTerms ||
                !username.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
              )
            }
            title={
              isRegistering
                ? !agreedToTerms
                  ? 'Must agree to terms'
                  : !username.trim()
                    ? 'Username required'
                    : !password.trim()
                      ? 'Password required'
                      : 'Ready to register'
                : 'Sign in'
            }
            aria-label={isRegistering ? 'Accept and create account' : 'Sign in'}
          >
            <LogIn size={16} />
            {isRegistering ? 'Accept & Create Account' : 'Sign In'}
          </button>

          {!isRegistering ? (
            <div className="auth-toggle">
              Don't have an account? <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="auth-toggle-link"
              >
                Create Account
              </button>
            </div>
          ) : (
            isUserRegistered() && (
              <div className="auth-toggle">
                Already have an account? <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="auth-toggle-link"
                >
                  Sign In
                </button>
              </div>
            )
          )}
        </form>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="auth-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3>Terms & Conditions</h3>
              <button className="auth-modal-close" onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="auth-modal-body">
              <p><strong>1. Data Responsibility:</strong> This software stores data <strong>locally</strong> in your device storage. The developer does not keep copies of your data.</p>
              <p><strong>2. User Responsibility:</strong> You are solely responsible for manual backups using the "Export Data" feature in settings.</p>
              <p><strong>3. License:</strong> This system is provided as a licensed product. Unauthorized distribution is prohibited.</p>
              <p><strong>4. "As-Is" Policy:</strong> The software is provided without warranties of any kind. Use at your own risk.</p>
              <hr style={{ opacity: 0.1, margin: '15px 0' }} />
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>By creating an account, you acknowledge that you understand the local-storage nature of this system.</p>
            </div>
            <div className="auth-modal-footer">
              <button className="auth-button" onClick={() => setShowTermsModal(false)}>I Understand</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
