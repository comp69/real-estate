import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Home, Bed, Bath, Square, Phone, Mail, Download, X } from 'lucide-react';
import axios from 'axios';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/projects/${slug}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
    setModalImage('');
  };

  if (!project) return <div className="loading">Loading...</div>;

  const allImages = [
    project.main_image,
    ...project.images.map(img => img.image_path)
  ];

  return (
    <div className="project-detail">
      {/* Image Modal */}
      {modalOpen && (
        <div className="image-modal" onClick={closeImageModal}>
          <button className="image-modal-close" onClick={closeImageModal}>
            <X size={24} />
          </button>
          <img
            src={modalImage}
            alt="Full size"
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Hero Gallery */}
      <div className="project-gallery">
        <motion.div 
          className="main-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img 
            src={`http://localhost:8000/storage/${allImages[selectedImage]}`}
            alt={project.title}
            onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=Project'}
            onClick={() => openImageModal(`http://localhost:8000/storage/${allImages[selectedImage]}`)}
          />
        </motion.div>
        <div className="thumbnail-strip">
          {allImages.map((img, i) => (
            <motion.div
              key={i}
              className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
              onClick={() => setSelectedImage(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={`http://localhost:8000/storage/${img}`}
                alt=""
                onError={(e) => e.target.src = 'https://via.placeholder.com/150x100'}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Project Header */}
        <motion.div 
          className="project-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="project-title-section">
            <span className="project-badge">{project.status}</span>
            <h1>{project.title}</h1>
            <p className="project-location-main">
              <MapPin size={20} />
              {project.location}
            </p>
          </div>
          {project.starting_price && (
            <div className="project-price-box">
              <span className="price-label">Starting From</span>
              <span className="price-value">PKR {Number(project.starting_price).toLocaleString()}</span>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="project-tabs">
          {['overview', 'features', 'floor-plans', 'payment-plans', 'location'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div 
          className="tab-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>About This Project</h2>
              <p className="project-description">{project.description}</p>
              
              <div className="project-quick-info">
                <div className="info-item">
                  <Home size={24} />
                  <span className="info-label">Type</span>
                  <span className="info-value">{project.type}</span>
                </div>
                {project.total_units && (
                  <div className="info-item">
                    <Square size={24} />
                    <span className="info-label">Total Units</span>
                    <span className="info-value">{project.total_units}</span>
                  </div>
                )}
                {project.size_range && (
                  <div className="info-item">
                    <Square size={24} />
                    <span className="info-label">Size Range</span>
                    <span className="info-value">{project.size_range}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="features-section">
              <h2>Key Features & Amenities</h2>
              <div className="features-grid">
                {project.features.map(feature => (
                  <motion.div 
                    key={feature.id} 
                    className="feature-card"
                    whileHover={{ y: -5 }}
                  >
                    <div className="feature-icon">{feature.icon || '✓'}</div>
                    <h4>{feature.feature_name}</h4>
                    {feature.feature_value && <p>{feature.feature_value}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'floor-plans' && (
            <div className="floorplans-section">
              <h2>Floor Plans</h2>
              <div className="floorplans-grid">
                {project.floor_plans.map(plan => (
                  <motion.div 
                    key={plan.id} 
                    className="floorplan-card"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img 
                      src={`http://localhost:8000/storage/${plan.image_path}`}
                      alt={plan.title}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Floor+Plan'}
                      onClick={() => openImageModal(`http://localhost:8000/storage/${plan.image_path}`)}
                    />
                    <div className="floorplan-info">
                      <h3>{plan.title}</h3>
                      <div className="floorplan-specs">
                        {plan.bedrooms && <span><Bed size={16} /> {plan.bedrooms} Bed</span>}
                        {plan.bathrooms && <span><Bath size={16} /> {plan.bathrooms} Bath</span>}
                        {plan.size && <span><Square size={16} /> {plan.size}</span>}
                      </div>
                      {plan.description && <p>{plan.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment-plans' && (
            <div className="payment-section">
              <h2>Payment Plans</h2>
              <div className="payment-plans">
                {project.payment_plans.map(plan => (
                  <motion.div 
                    key={plan.id} 
                    className="payment-card"
                    whileHover={{ y: -5 }}
                  >
                    <h3>{plan.plan_name}</h3>
                    <div className="payment-details">
                      <div className="payment-row">
                        <span>Down Payment:</span>
                        <strong>{plan.down_payment}</strong>
                      </div>
                      <div className="payment-row">
                        <span>Installments:</span>
                        <strong>{plan.installments}</strong>
                      </div>
                      {plan.details && Object.entries(plan.details).map(([key, value]) => (
                        <div key={key} className="payment-row">
                          <span>{key}:</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="location-section">
              <h2>Location & Map</h2>
              <p className="location-address">
                <MapPin size={20} />
                {project.location}
              </p>
              {project.location_map && (
                <div className="map-container" dangerouslySetInnerHTML={{ __html: project.location_map }} />
              )}
            </div>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="project-contact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Interested in This Project?</h2>
          <p>Contact us for more information and site visits</p>
          <div className="contact-buttons">
            {project.brochure_pdf && (
              <a href={`http://localhost:8000/storage/${project.brochure_pdf}`} className="btn btn-outline" download>
                <Download size={20} />
                Download Brochure
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;