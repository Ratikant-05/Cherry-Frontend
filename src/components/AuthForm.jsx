import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🍒</span>
              <h1 className="auth-title">Cherry</h1>
            </div>
            <p className="auth-subtitle">
              {isLogin ? 'Welcome back to your productivity hub!' : 'Join thousands who stay organized with Cherry'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="form-input"
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {!isLogin && (
                <div className="password-requirements">
                  <small>Password must be at least 6 characters long</small>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  {isLogin ? 'Signing you in...' : 'Creating your account...'}
                </span>
              ) : (
                <>
                  <span className="button-icon">{isLogin ? '🚀' : '✨'}</span>
                  {isLogin ? 'Sign In to Cherry' : 'Create Your Account'}
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <div className="auth-divider">
              <span>or</span>
            </div>
            <p className="auth-switch">
              {isLogin ? "New to Cherry?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="auth-toggle"
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        <div className="auth-features">
          <div className="features-header">
            <h3>Why choose Cherry? 🍒</h3>
            <p>Join thousands of productive people who trust Cherry to organize their lives</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h4>Smart Task Management</h4>
              <p>Create, organize, and prioritize tasks with intelligent suggestions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Productivity Analytics</h4>
              <p>Track your progress with beautiful charts and insights</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>Goal Achievement</h4>
              <p>Set deadlines, track time, and celebrate your wins</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h4>Dark Mode Support</h4>
              <p>Work comfortably in any lighting condition</p>
            </div>
          </div>
          <div className="social-proof">
            <div className="stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Happy Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Tasks Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;