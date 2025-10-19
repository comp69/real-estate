import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from './Toast';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'chinagroup2024';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (formData.username === ADMIN_USERNAME && formData.password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUsername', ADMIN_USERNAME);
        showToast('Login successful! Welcome back!', 'success');
        setTimeout(() => navigate('/admin/dashboard'), 800);
      } else {
        showToast('Invalid username or password', 'error');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="admin-login-page" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1465101178521-c1a6f3b5f0a3?auto=format&fit=crop&w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <motion.button
        className="back-home-btn"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Back to Home
      </motion.button>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="login-header"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="login-logo">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Lock size={40} />
            </motion.div>
          </div>
          <h1>Admin Login</h1>
          <p>
            <Sparkles size={16} style={{ display: 'inline' }} />
            {' '}China Group Management Portal
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div 
            className="form-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label>
              <User size={18} />
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
              required
            />
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="login-btn"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(10, 102, 194, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⟳
              </motion.div>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <motion.div 
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >

        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;