import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Edit, Trash2, Eye, Home } from 'lucide-react';
import axios from 'axios';
import { useToast } from './Toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    // Fetch projects
    fetchProjects();
  }, [navigate]);

  const fetchProjects = () => {
    setLoading(true);
    axios.get('http://localhost:8000/api/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
        // showToast(`Loaded ${res.data.length} projects successfully`, 'success');
      })
      .catch(err => {
        console.error(err);
        showToast('Error loading projects. Please try again.', 'error');
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUsername');
    showToast('Logged out successfully', 'success');
    navigate('/admin/login');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      axios.delete(`http://localhost:8000/api/projects/${id}`)
        .then(() => {
          showToast(`Project "${title}" deleted successfully!`, 'success');
          fetchProjects();
        })
        .catch(err => {
          console.error(err);
          showToast('Error deleting project. Please try again.', 'error');
        });
    }
  };

  const handleViewProject = (slug) => {
    window.open(`/projects/${slug}`, '_blank');
    showToast('Opening project in new tab...', 'info');
  };

  const handleEditProject = (id, title) => {
    navigate(`/admin/projects/edit/${id}`);
    showToast(`Editing project: ${title}`, 'info');
  };

  const adminUsername = localStorage.getItem('adminUsername');

  return (
    <div className="admin-dashboard">
      <motion.div 
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-header-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminUsername}!</p>
          </motion.div>
          <motion.div 
            className="header-buttons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className="home-btn"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--light-gray)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={18} />
              Back to Home
            </motion.button>
            <motion.button
              className="logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.05, backgroundColor: '#fee' }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <div className="admin-container">
        <motion.div 
          className="admin-toolbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="toolbar-left">
            <h2>Projects Management</h2>
            {!loading && (
              <span className="projects-count">
                {projects.length} project{projects.length !== 1 ? 's' : ''} total
              </span>
            )}
          </div>
          <motion.button
            className="btn btn-primary"
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 25px rgba(10, 102, 194, 0.3)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigate('/admin/projects/new');
              showToast('Creating new project...', 'info');
            }}
          >
            <Plus size={20} />
            Add New Project
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </motion.div>
          ) : projects.length === 0 ? (
            <motion.div 
              key="empty"
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="empty-icon">🏗️</div>
              <h3>No projects yet</h3>
              <p>Get started by creating your first project</p>
              <motion.button
                className="btn btn-primary"
                onClick={() => navigate('/admin/projects/new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Create First Project
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="projects"
              className="projects-table-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="projects-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ 
                          backgroundColor: 'var(--light-gray)',
                          transition: { duration: 0.2 }
                        }}
                      >
                        <td>
                          <div className="table-image-container">
                            <img 
                              src={`http://localhost:8000/storage/${project.main_image}`}
                              alt={project.title}
                              className="table-image"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x75/f3f4f6/6b7280?text=No+Image';
                                e.target.className = 'table-image table-image-fallback';
                              }}
                            />
                            {project.is_featured && (
                              <span className="featured-badge">Featured</span>
                            )}
                          </div>
                        </td>
                        <td className="project-title">
                          <strong>{project.title}</strong>
                          {project.description && (
                            <span className="project-description">
                              {project.description.substring(0, 60)}...
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge badge-type badge-${project.type}`}>
                            {project.type}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-status badge-${project.status}`}>
                            {project.status}
                          </span>
                        </td>
                        <td>
                          <div className="location-cell">
                            <span className="location-text">{project.location}</span>
                          </div>
                        </td>
                        <td>
                          {project.starting_price ? (
                            <div className="price-cell">
                              <span className="price-amount">
                                PKR {Number(project.starting_price).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="price-na">Not set</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <motion.button 
                              className="action-btn view"
                              onClick={() => handleViewProject(project.slug)}
                              title="View Project"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button 
                              className="action-btn edit"
                              onClick={() => handleEditProject(project.id, project.title)}
                              title="Edit Project"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button 
                              className="action-btn delete"
                              onClick={() => handleDelete(project.id, project.title)}
                              title="Delete Project"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <motion.div 
                className="table-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="footer-info">
                  <span>
                    Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                  </span>
                  <span className="last-updated">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <motion.button
                  className="btn btn-outline refresh-btn"
                  onClick={fetchProjects}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;