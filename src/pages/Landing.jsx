import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Phone, Mail } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">
          <img src="/favicon.jpg" alt="Logo" className="logo-img" />
          <span>ANESRAD INN</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/login')} className="btn-login">Login</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Experience Luxury and Comfort</h1>
          <p>Welcome to Anesrad Inn, where every stay is a memorable journey. Discover the perfect blend of modern elegance and warm hospitality.</p>
          <button className="btn-primary-large" onClick={() => navigate('/login')}>
            Book Your Stay <ArrowRight size={20} />
          </button>
        </div>
        <div className="hero-image">
          <img src="/hotel-image.jpg" alt="Anesrad Inn" className="main-hotel-img" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon"><Star /></div>
          <h3>Premium Service</h3>
          <p>World-class hospitality tailored to your needs.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><MapPin /></div>
          <h3>Prime Location</h3>
          <p>Located in the heart of the city, close to everything.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Phone /></div>
          <h3>24/7 Support</h3>
          <p>Our team is always here to assist you.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h4>ANESRAD INN</h4>
            <p>Your home away from home.</p>
          </div>
          <div className="footer-contact">
            <p><Phone size={16} /> +63 9XX XXX XXXX</p>
            <p><Mail size={16} /> info@anesradinn.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Anesrad Inn. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          font-family: 'Inter', sans-serif;
          color: #333;
          background: #fff;
          min-height: 100vh;
        }
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .landing-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: 1px;
          color: #1a1a1a;
        }
        .logo-img {
          width: 40px;
          height: 40px;
        }
        .btn-login {
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          border: 1px solid #1a1a1a;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-login:hover {
          background: #1a1a1a;
          color: #fff;
        }
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5rem 5%;
          gap: 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .hero-content {
          flex: 1;
        }
        .hero-content h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        .hero-content p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2.5rem;
          max-width: 500px;
          line-height: 1.6;
        }
        .btn-primary-large {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 2.5rem;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .btn-primary-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .hero-image {
          flex: 1.2;
        }
        .main-hotel-img {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          object-fit: cover;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 5rem 5%;
          background: #f9f9f9;
        }
        .feature-card {
          padding: 2.5rem;
          background: #fff;
          border-radius: 20px;
          text-align: center;
          transition: transform 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-10px);
        }
        .feature-icon {
          width: 60px;
          height: 60px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .feature-card p {
          color: #666;
          line-height: 1.5;
        }
        .landing-footer {
          padding: 4rem 5% 2rem;
          background: #1a1a1a;
          color: #fff;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .footer-bottom {
          border-top: 1px solid #333;
          padding-top: 2rem;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }
        @media (max-width: 968px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
            padding-top: 3rem;
          }
          .hero-content h1 {
            font-size: 2.5rem;
          }
          .hero-content p {
            margin: 0 auto 2rem;
          }
          .btn-primary-large {
            margin: 0 auto;
          }
          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
