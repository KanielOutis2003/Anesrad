import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, Mail, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    try {
      // Simple mock login for now
      // In a real app, this would be supabase.auth.signInWithPassword({ email, password })
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (email === 'admin@anesrad.com' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Welcome back, Admin!', {
          icon: '👋',
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
        navigate('/');
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.', {
        duration: 4000,
        position: 'top-center'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email first.');
      return;
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Sending recovery email...',
        success: `Recovery link sent to ${email}!`,
        error: 'Failed to send recovery email.',
      }
    );
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" 
            alt="Hotel" 
            className="login-image" 
          />
          <div className="overlay">
            <div className="overlay-text">
              <h2>Welcome Back</h2>
              <p>Manage your hotel operations with ease and efficiency.</p>
            </div>
          </div>
        </div>
        <div className="login-right">
          <div className="login-header">
            <div className="login-logo">
              <img src="/favicon.jpg" alt="Logo" className="logo-img-small" />
              <span>ANESRAD INN</span>
            </div>
            <h1>Login to Dashboard</h1>
            <p>Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                placeholder="admin@anesrad.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label><Lock size={16} /> Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" onClick={handleForgotPassword} className="forgot-password">Forgot password?</a>
            </div>
            <button type="submit" className="btn-login-submit" disabled={loading}>
              {loading ? 'Logging in...' : (
                <>Sign In <ChevronRight size={18} /></>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#">Contact Support</a></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
          font-family: 'Inter', sans-serif;
        }
        .login-card {
          display: flex;
          width: 100%;
          max-width: 1000px;
          height: 600px;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .login-left {
          flex: 1.2;
          position: relative;
          display: none;
        }
        @media (min-width: 768px) {
          .login-left { display: block; }
        }
        .login-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.1));
          display: flex;
          align-items: flex-end;
          padding: 3rem;
        }
        .overlay-text {
          color: #fff;
        }
        .overlay-text h2 {
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }
        .overlay-text p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 320px;
          line-height: 1.6;
        }
        .login-right {
          flex: 1;
          padding: 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #fff;
        }
        .login-header {
          margin-bottom: 2.5rem;
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: 1px;
          font-size: 1.2rem;
          color: #1a1a1a;
        }
        .logo-img-small {
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }
        .login-header h1 {
          font-size: 2rem;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }
        .login-header p {
          color: #666;
          font-size: 0.95rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-group label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #4a4a4a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .input-group input {
          padding: 0.9rem 1.2rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          transition: all 0.2s;
          font-size: 1rem;
        }
        .input-group input:focus {
          border-color: #1a1a1a;
          background: #fff;
          outline: none;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.06);
        }
        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }
        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          cursor: pointer;
          font-weight: 500;
        }
        .forgot-password {
          color: #1a1a1a;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-password:hover {
          color: #3b82f6;
        }
        .btn-login-submit {
          padding: 1.1rem;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: 1rem;
        }
        .btn-login-submit:hover {
          background: #000;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .btn-login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .login-footer {
          margin-top: 2.5rem;
          text-align: center;
          font-size: 0.95rem;
          color: #64748b;
        }
        .login-footer a {
          color: #1a1a1a;
          font-weight: 700;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default Login;
