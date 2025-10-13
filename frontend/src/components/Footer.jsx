import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-logo">CHINA GROUP</h3>
              <p>Building dreams and creating futures since 1998. Your trusted partner in real estate development.</p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/vision">Our Vision</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Our Services</h4>
              <ul>
                <li><Link to="/projects">Residential Projects</Link></li>
                <li><Link to="/projects">Commercial Projects</Link></li>
                <li><Link to="/projects">Apartments</Link></li>
                <li><Link to="/projects">Houses & Villas</Link></li>
                <li><Link to="/contact">Consultation</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul className="contact-info">
                <li>
                  <Phone size={16} />
                  <span>+92 21 1234 5678</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>info@chinagrouppk.com</span>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Shahrah-e-Faisal, Karachi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} China Group Pakistan. All rights reserved.</p>
          <div className="footer-links">
            <a href="/">Privacy Policy</a>
            <a href="/">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;