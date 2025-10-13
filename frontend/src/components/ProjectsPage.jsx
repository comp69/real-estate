import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, MapPin } from 'lucide-react';
import axios from 'axios';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/projects')
      .then(res => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [filterType, filterStatus, searchTerm, projects]);

  return (
    <div className="projects-page">
      <motion.div 
        className="page-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Explore our diverse portfolio of residential and commercial developments
          </motion.p>
        </div>
      </motion.div>

      <motion.div 
        className="filters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="filters-container">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search projects or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <div className="filter-group">
              <Filter size={18} />
              <span>Type:</span>
              <button 
                className={filterType === 'all' ? 'active' : ''}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={filterType === 'apartment' ? 'active' : ''}
                onClick={() => setFilterType('apartment')}
              >
                Apartments
              </button>
              <button 
                className={filterType === 'house' ? 'active' : ''}
                onClick={() => setFilterType('house')}
              >
                Houses
              </button>
              <button 
                className={filterType === 'commercial' ? 'active' : ''}
                onClick={() => setFilterType('commercial')}
              >
                Commercial
              </button>
            </div>

            <div className="filter-group">
              <span>Status:</span>
              <button 
                className={filterStatus === 'all' ? 'active' : ''}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={filterStatus === 'upcoming' ? 'active' : ''}
                onClick={() => setFilterStatus('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={filterStatus === 'ongoing' ? 'active' : ''}
                onClick={() => setFilterStatus('ongoing')}
              >
                Ongoing
              </button>
              <button 
                className={filterStatus === 'completed' ? 'active' : ''}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="projects-content">
        <div className="projects-count">
          <p>Showing {filteredProjects.length} projects</p>
        </div>

        <div className="projects-list">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link to={`/projects/${project.slug}`}>
                <div className="project-item-image">
                  <img 
                    src={`http://localhost:8000/storage/${project.main_image}`}
                    alt={project.title}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x500?text=Project'}
                  />
                  <div className="project-item-badge">{project.status}</div>
                </div>
                <div className="project-item-content">
                  <div className="project-item-header">
                    <h3>{project.title}</h3>
                    <span className="project-item-type">{project.type}</span>
                  </div>
                  <p className="project-item-location">
                    <MapPin size={16} />
                    {project.location}
                  </p>
                  <p className="project-item-desc">{project.description}</p>
                  <div className="project-item-footer">
                    {project.starting_price && (
                      <div className="project-item-price">
                        Starting from <strong>PKR {Number(project.starting_price).toLocaleString()}</strong>
                      </div>
                    )}
                    <span className="view-details">View Details →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>No projects found</h3>
            <p>Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;