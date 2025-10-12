import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      axios.delete(`http://localhost:8000/api/projects/${id}`)
        .then(() => {
          alert('Project deleted successfully!');
          fetchProjects();
        })
        .catch(err => {
          console.error(err);
          alert('Error deleting project');
        });
    }
  };

  const adminUsername = localStorage.getItem('adminUsername');

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminUsername}!</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-toolbar">
          <h2>Projects Management</h2>
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/projects/new')}
          >
            <Plus size={20} />
            Add New Project
          </motion.button>
        </div>

        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Click "Add New Project" to create your first project</p>
          </div>
        ) : (
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
                {projects.map((project) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <img 
                        src={`http://localhost:8000/storage/${project.main_image}`}
                        alt={project.title}
                        className="table-image"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                      />
                    </td>
                    <td className="project-title">{project.title}</td>
                    <td>
                      <span className="badge badge-type">{project.type}</span>
                    </td>
                    <td>
                      <span className={`badge badge-status badge-${project.status}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{project.location}</td>
                    <td>PKR {Number(project.starting_price).toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view"
                          onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDelete(project.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;