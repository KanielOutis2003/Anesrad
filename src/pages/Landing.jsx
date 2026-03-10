import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Phone, Mail, CheckCircle2, Coffee, Wifi, ShieldCheck, Waves } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Landing = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dbRooms, setDbRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    fetchRooms();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      setDbRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const roomImages = {
    'Standard': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    'Deluxe': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    'Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
  };

  return (
    <div className="landing-page">
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="landing-logo">
          <img src="/favicon.jpg" alt="Logo" className="logo-img" />
          <span>ANESRAD INN</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#amenities">Amenities</a>
          <button onClick={() => navigate('/login')} className="btn-login">Login</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">Welcome to Anesrad Inn</span>
          <h1>Your Serene Escape in the Heart of the City</h1>
          <p>Experience the perfect blend of modern luxury and local charm. We provide a sanctuary for travelers seeking comfort and elegance.</p>
          <div className="hero-btns">
            <button className="btn-primary-large" onClick={() => navigate('/login')}>
              Book Your Stay <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large">Explore Rooms</button>
          </div>
          <div className="hero-stats">
            <div className="h-stat">
              <strong>100+</strong>
              <span>Happy Guests</span>
            </div>
            <div className="h-stat">
              <strong>50+</strong>
              <span>Luxury Rooms</span>
            </div>
            <div className="h-stat">
              <strong>4.9/5</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="image-card">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" alt="Anesrad Inn" className="main-hotel-img" />
            <div className="image-badge">
              <Star fill="gold" color="gold" size={16} />
              <span>Premium Rated</span>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-preview">
        <div className="about-grid">
          <div className="about-img-group">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" alt="Lobby" />
          </div>
          <div className="about-text">
            <h2>Elegance in Every Detail</h2>
            <p>From the moment you step into our lobby, you'll feel the Anesrad difference. Our dedicated staff is here to ensure your stay is nothing short of perfect.</p>
            <ul className="check-list">
              <li><CheckCircle2 size={18} /> 24-hour Concierge Service</li>
              <li><CheckCircle2 size={18} /> Professional Housekeeping</li>
              <li><CheckCircle2 size={18} /> Seamless Check-in Experience</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="rooms" className="rooms-section">
        <div className="section-header">
          <h2>Our Exquisite Rooms</h2>
          <p>Choose from our selection of premium accommodations designed for your ultimate comfort.</p>
        </div>
        <div className="rooms-grid">
          {loading ? (
            <div className="loading-placeholder">Loading rooms...</div>
          ) : (
            dbRooms.map((room, i) => (
              <div key={room.id || i} className="room-card">
                <div className="room-img-wrap">
                  <img src={roomImages[room.type] || roomImages.Standard} alt={room.type} />
                  <div className="price-tag">₱{room.rate?.toLocaleString()} / night</div>
                </div>
                <div className="room-info">
                  <h3>{room.type} Room {room.num}</h3>
                  <p>Experience our {room.type.toLowerCase()} room, equipped with all the essentials for a comfortable stay.</p>
                  <button className="btn-text">View Details <ArrowRight size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="amenities" className="amenities-section">
        <div className="section-header">
          <h2>Premium Amenities</h2>
          <p>We provide everything you need for a comfortable and productive stay.</p>
        </div>
        <div className="amenities-grid">
          {[
            { icon: <Wifi />, title: 'High-speed WiFi', desc: 'Stay connected with ultra-fast internet throughout the hotel.' },
            { icon: <Coffee />, title: 'Daily Breakfast', desc: 'Start your day with a delicious range of local and international dishes.' },
            { icon: <ShieldCheck />, title: '24/7 Security', desc: 'Your safety is our priority with round-the-clock monitoring.' },
            { icon: <Waves />, title: 'Infinity Pool', desc: 'Relax and unwind in our temperature-controlled swimming pool.' },
          ].map((item, i) => (
            <div key={i} className="amenity-card">
              <div className="amenity-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo">
              <img src="/favicon.jpg" alt="Logo" className="logo-img" />
              <span style={{ color: '#fff' }}>ANESRAD INN</span>
            </div>
            <p>Providing exceptional hospitality and memorable experiences since 2020.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">Home</a>
            <a href="#about">About Us</a>
            <a href="#rooms">Rooms</a>
            <a href="#amenities">Amenities</a>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p><Phone size={16} /> +63 9XX XXX XXXX</p>
            <p><Mail size={16} /> info@anesradinn.com</p>
            <p><MapPin size={16} /> 123 Hotel St, City, Philippines</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Anesrad Inn. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          font-family: 'Inter', 'Nunito', sans-serif;
          color: #333;
          background: #fff;
          min-height: 100vh;
          scroll-behavior: smooth;
        }
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          background: transparent;
        }
        .landing-nav.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 5%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .landing-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 1px;
          color: #1a1a1a;
        }
        .logo-img { width: 36px; height: 36px; border-radius: 8px; }
        .nav-links { display: flex; align-items: center; gap: 2.5rem; }
        .nav-links a { 
          text-decoration: none; 
          color: #444; 
          font-weight: 600; 
          font-size: 0.95rem;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: #1a1a1a; }
        .btn-login {
          padding: 0.6rem 1.8rem;
          border-radius: 50px;
          border: 2px solid #1a1a1a;
          background: #1a1a1a;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s;
        }
        .btn-login:hover { background: transparent; color: #1a1a1a; }

        .hero-section {
          display: flex;
          align-items: center;
          padding: 10rem 5% 6rem;
          gap: 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .hero-content { flex: 1; }
        .badge {
          background: #eff6ff;
          color: #3b82f6;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.85rem;
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        .hero-content h1 {
          font-size: 4.2rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          font-weight: 800;
        }
        .hero-content p {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 2.5rem;
          max-width: 550px;
          line-height: 1.7;
        }
        .hero-btns { display: flex; gap: 1.2rem; margin-bottom: 3.5rem; }
        .btn-primary-large {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1.1rem 2.8rem;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary-large:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.15); }
        .btn-secondary-large {
          padding: 1.1rem 2.8rem;
          background: #f3f4f6;
          color: #1a1a1a;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-secondary-large:hover { background: #e5e7eb; }

        .hero-stats { display: flex; gap: 3rem; }
        .h-stat strong { display: block; font-size: 1.8rem; color: #1a1a1a; margin-bottom: 0.3rem; }
        .h-stat span { color: #888; font-size: 0.9rem; font-weight: 600; }

        .hero-image-container { flex: 1.1; position: relative; }
        .image-card { position: relative; }
        .main-hotel-img {
          width: 100%;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.12);
          object-fit: cover;
          height: 600px;
        }
        .image-badge {
          position: absolute;
          bottom: 40px;
          left: -30px;
          background: #fff;
          padding: 1.2rem 2rem;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .about-preview { padding: 8rem 5%; background: #fcfcfc; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; max-width: 1200px; margin: 0 auto; }
        .about-img-group img { width: 100%; border-radius: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .about-text h2 { font-size: 2.8rem; margin-bottom: 1.5rem; color: #1a1a1a; }
        .about-text p { font-size: 1.15rem; color: #666; line-height: 1.8; margin-bottom: 2rem; }
        .check-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .check-list li { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #1a1a1a; }
        .check-list li :global(svg) { color: #10b981; }

        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-header h2 { font-size: 3rem; margin-bottom: 1rem; color: #1a1a1a; }
        .section-header p { color: #666; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }

        .rooms-section { padding: 8rem 5%; }
        .rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; max-width: 1300px; margin: 0 auto; }
        .room-card { 
          background: #fff; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s;
        }
        .room-card:hover { transform: translateY(-10px); }
        .room-img-wrap { position: relative; height: 280px; }
        .room-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .price-tag {
          position: absolute;
          top: 20px; right: 20px;
          background: #fff;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          font-weight: 800;
          color: #1a1a1a;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .room-info { padding: 2rem; }
        .room-info h3 { font-size: 1.5rem; margin-bottom: 0.8rem; }
        .room-info p { color: #666; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6; }
        .btn-text {
          background: none; border: none; color: #1a1a1a; font-weight: 700;
          display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 0;
        }

        .amenities-section { padding: 8rem 5%; background: #1a1a1a; color: #fff; }
        .amenities-section h2 { color: #fff; }
        .amenities-section p { color: #999; }
        .amenities-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; max-width: 1300px; margin: 0 auto; }
        .amenity-card { 
          background: rgba(255,255,255,0.05); 
          padding: 2.5rem 2rem; 
          border-radius: 24px;
          text-align: center;
          transition: background 0.3s;
        }
        .amenity-card:hover { background: rgba(255,255,255,0.08); }
        .amenity-icon { 
          width: 64px; height: 64px; background: #fff; color: #1a1a1a;
          border-radius: 20px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .amenity-card h4 { font-size: 1.25rem; margin-bottom: 0.8rem; }
        .amenity-card p { font-size: 0.9rem; line-height: 1.6; }

        .landing-footer { padding: 6rem 5% 3rem; background: #0a0a0a; color: #fff; }
        .footer-content { 
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6rem;
          max-width: 1300px; margin: 0 auto 4rem;
        }
        .footer-brand p { color: #777; margin-top: 1.5rem; max-width: 300px; line-height: 1.7; }
        .footer-links { display: flex; flex-direction: column; gap: 1rem; }
        .footer-links h4, .footer-contact h4 { margin-bottom: 1.5rem; font-size: 1.1rem; }
        .footer-links a { color: #777; text-decoration: none; transition: color 0.3s; }
        .footer-links a:hover { color: #fff; }
        .footer-contact p { color: #777; display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .footer-bottom { border-top: 1px solid #222; padding-top: 3rem; text-align: center; color: #555; font-size: 0.9rem; }

        @media (max-width: 1100px) {
          .hero-section { flex-direction: column; text-align: center; padding-top: 8rem; }
          .hero-content h1 { font-size: 3.2rem; }
          .hero-content p { margin: 0 auto 2.5rem; }
          .hero-btns, .hero-stats { justify-content: center; }
          .hero-image-container { width: 100%; margin-top: 2rem; }
          .main-hotel-img { height: 450px; }
          .rooms-grid { grid-template-columns: repeat(2, 1fr); }
          .amenities-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-content { grid-template-columns: 1fr 1fr; gap: 3rem; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .about-grid { grid-template-columns: 1fr; gap: 3rem; }
          .rooms-grid, .amenities-grid { grid-template-columns: 1fr; }
          .footer-content { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
