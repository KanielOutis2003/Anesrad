import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, Mail, ChevronRight, Hotel, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Welcome back to Anesrad Inn!', {
          icon: '🏨',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 20px',
          },
        });
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast.success(`Password reset link sent to ${forgotEmail}!`, {
        duration: 5000,
        icon: '✉️'
      });
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (err) {
      toast.error(err.message || 'Failed to send recovery email.', {
        duration: 4000,
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-backdrop"></div>
      
      <div className="login-card-wrapper">
        <div className="login-card-left">
          <div className="card-image-container">
            <img src="/hotel-image.jpg" alt="Hotel Backdrop" className="card-bg-image" />
            <div className="card-overlay">
              <div className="brand-content">
                <div className="brand-info">
                  <h2>Anesrad Inn</h2>
                  <p>Elevating Hospitality Standards</p>
                </div>
              </div>
              
              <div className="testimonial-snippet">
                <div className="stars">★★★★★</div>
                <p>"Seamless management for modern hotels. The efficiency we needed is finally here."</p>
                <div className="author">— Management Team</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-card-right">
          <div className="login-content">
            <div className="login-header">
              <div className="mobile-logo">
                 <img src="/favicon.jpg" alt="Logo" className="favicon-logo" />
              </div>
              <h1>Welcome Back</h1>
              <p>Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="login-form-fields">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-control">
                  <Mail className="field-icon" size={18} />
                  <input
                    type="email"
                    placeholder="admin@anesrad.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label>Password</label>
                  <button type="button" onClick={() => setShowForgotModal(true)} className="text-action-btn">
                    Forgot password?
                  </button>
                </div>
                <div className="input-control">
                  <Lock className="field-icon" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="remember-me-row">
                <label className="checkbox-container">
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark"></span>
                  Keep me signed in
                </label>
                <div className="secure-badge">
                  <ShieldCheck size={14} />
                  <span>Secure Login</span>
                </div>
              </div>

              <button type="submit" className="primary-login-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner"></span>
                ) : (
                  <>
                    <span>Sign In to System</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="login-copyright">
              <p>&copy; {new Date().getFullYear()} ANESRAD INN • Hotel Management System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="close-btn" onClick={() => setShowForgotModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-control">
                    <Mail className="field-icon" size={18} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={forgotLoading}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="modal-submit-btn" disabled={forgotLoading}>
                  {forgotLoading ? <span className="btn-spinner"></span> : 'Send Reset Link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --surface: #ffffff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --bg-soft: #f8fafc;
        }

        .login-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(-45deg, #0f172a, #1e293b, #2563eb, #1e293b);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          padding: 20px;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .login-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.15), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.1), transparent 40%);
          z-index: 1;
        }

        .login-card-wrapper {
          width: 100%;
          max-width: 1040px;
          min-height: 640px;
          background: var(--surface);
          border-radius: 28px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 2;
          animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-card-left {
          flex: 1.1;
          position: relative;
          display: none;
        }

        @media (min-width: 900px) {
          .login-card-left {
            display: block;
          }
        }

        .card-image-container {
          height: 100%;
          width: 100%;
          position: relative;
        }

        .card-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 10s ease;
        }

        .login-card-wrapper:hover .card-bg-image {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.85));
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
        }

        .brand-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-info h2 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .brand-info p {
          font-size: 16px;
          opacity: 0.8;
          margin: 4px 0 0;
        }

        .testimonial-snippet {
          max-width: 340px;
        }

        .stars {
          color: #fbbf24;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }

        .testimonial-snippet p {
          font-size: 18px;
          font-style: italic;
          line-height: 1.6;
          opacity: 0.95;
          margin-bottom: 12px;
        }

        .author {
          font-size: 14px;
          font-weight: 600;
          opacity: 0.8;
        }

        .login-card-right {
          flex: 1;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
        }

        .login-content {
          width: 100%;
          max-width: 380px;
        }

        .login-header {
          margin-bottom: 36px;
        }

        .mobile-logo {
          margin-bottom: 24px;
        }

        .favicon-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .login-header h1 {
          font-size: 30px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
          margin-bottom: 10px;
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.5;
        }

        .login-form-fields {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .label-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .text-action-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .text-action-btn:hover {
          text-decoration: underline;
        }

        .input-control {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          transition: color 0.2s;
        }

        .input-control input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 1.5px solid var(--border);
          border-radius: 14px;
          font-size: 15px;
          background: var(--bg-soft);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-main);
        }

        .input-control input:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .input-control input:focus + .field-icon {
          color: var(--primary);
        }

        .remember-me-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
          user-select: none;
        }

        .checkbox-container input {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          border-radius: 6px;
          display: inline-block;
          position: relative;
          transition: all 0.2s;
        }

        .checkbox-container input:checked ~ .checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkmark:after {
          content: '';
          position: absolute;
          display: none;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
          background: #ecfdf5;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .primary-login-btn {
          margin-top: 8px;
          padding: 16px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .primary-login-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -3px rgba(37, 99, 235, 0.4);
        }

        .primary-login-btn:active {
          transform: translateY(0);
        }

        .primary-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .close-btn {
          background: var(--bg-soft);
          border: none;
          color: var(--text-muted);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .modal-body p {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .modal-submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 24px;
          transition: all 0.2s;
        }

        .modal-submit-btn:hover {
          background: var(--primary-dark);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-copyright {
          margin-top: 48px;
          text-align: center;
        }

        .login-copyright p {
          color: #94a3b8;
          font-size: 12px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .login-container {
            padding: 0;
            background: white;
          }
          
          .login-card-wrapper {
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }

          .login-card-right {
            padding: 32px 24px;
          }

          .login-header h1 {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
