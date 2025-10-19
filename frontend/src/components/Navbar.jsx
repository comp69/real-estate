import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Palette } from 'lucide-react';
import { useTheme } from './ThemeContext';
import './Navbar.css';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const location = useLocation();
  const { currentTheme, setCurrentTheme, themes } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/projects', label: 'Projects' },
    { path: '/vision', label: 'Our Vision' },
    { path: '/contact', label: 'Contact' },
  { path: '/admin/login', label: 'Login', isLogin: true },
  ];

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo-link">
          <motion.img
            src={logoImg}
            alt="China Group"
            className="nav-logo-img"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <motion.div
            className="nav-logo-text"
            style={{ display: 'none' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CHINA GROUP
          </motion.div>
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''} ${
                link.isLogin ? 'login-link-muted' : ''
              }`}
            >
              <motion.span whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                {link.label}
              </motion.span>
              {location.pathname === link.path && (
                <motion.div
                  className="nav-underline"
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}

          <div className="theme-switcher">
            <motion.button
              className="theme-btn"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <Palette size={20} />
            </motion.button>

            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div
                  className="theme-menu"
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {Object.keys(themes).map((themeKey) => (
                    <motion.button
                      key={themeKey}
                      className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentTheme(themeKey);
                        setThemeMenuOpen(false);
                      }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="theme-preview" style={{ 
                        background: themes[themeKey]['--gradient'] 
                      }}></div>
                      <span>{themes[themeKey].name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`mobile-link ${location.pathname === link.path ? 'active' : ''} ${
                      link.isLogin ? 'login-link-muted' : ''
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;