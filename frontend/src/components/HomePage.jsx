import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Home, Trophy, Users } from 'lucide-react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/projects')
      .then(res => setFeaturedProjects(res.data.filter(p => p.is_featured).slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { icon: Building2, value: '50+', label: 'Projects Completed' },
    { icon: Home, value: '2000+', label: 'Happy Families' },
    { icon: Trophy, value: '25+', label: 'Years Experience' },
    { icon: Users, value: '100+', label: 'Expert Team' },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Building Dreams,
            <br />
            <span className="gradient-text">Creating Futures</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Premium real estate solutions in Karachi's most sought-after locations
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
          </motion.div>
        </div>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div className="stat-icon">
                  <stat.icon size={32} />
                </div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Featured Projects</h2>
          </motion.div>

          <div className="projects-grid">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -15 }}
              >
                <Link to={`/projects/${project.slug}`}>
                  <div className="project-image">
                    <img 
                      src={`http://localhost:8000/storage/${project.main_image}`} 
                      alt={project.title}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Project'}
                    />
                    <div className="project-overlay">
                      <span className="project-status">{project.status}</span>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p className="project-location">{project.location}</p>
                    <p className="project-desc">{project.description.substring(0, 100)}...</p>
                    <div className="project-meta">
                      <span className="project-type">{project.type}</span>
                      {project.starting_price && (
                        <span className="project-price">From PKR {Number(project.starting_price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Find Your Dream Home?</h2>
          <p>Let our experts guide you through the journey</p>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;