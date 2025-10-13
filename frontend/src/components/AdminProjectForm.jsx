import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Plus, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from './Toast';
import './AdminProjectForm.css';

const AdminProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState(id);
  const [projectData, setProjectData] = useState(null);

  // Basic Info
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    status: 'upcoming',
    location: '',
    starting_price: '',
    size_range: '',
    total_units: '',
    location_map: '',
    is_featured: false,
    is_active: true,
    contact_phone: '',
    contact_email: ''
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState([]);

  // Features
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: '', value: '', icon: '' });

  // Floor Plans
  const [floorPlans, setFloorPlans] = useState([]);
  const [newFloorPlan, setNewFloorPlan] = useState({
    title: '', bedrooms: '', bathrooms: '', size: '', description: '', image: null
  });
  const [floorPlanImagePreview, setFloorPlanImagePreview] = useState('');

  // Payment Plans
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [newPaymentPlan, setNewPaymentPlan] = useState({
    plan_name: '', down_payment: '', installments: '', details: {}
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    if (isEdit) {
      loadProject();
    }
  }, [id, isEdit, navigate]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/projects/${id}`);
      const project = response.data;
      setProjectData(project);
      
      // Set basic form data
      setFormData({
        title: project.title || '',
        description: project.description || '',
        type: project.type || 'apartment',
        status: project.status || 'upcoming',
        location: project.location || '',
        starting_price: project.starting_price || '',
        size_range: project.size_range || '',
        total_units: project.total_units || '',
        location_map: project.location_map || '',
        is_featured: Boolean(project.is_featured),
        is_active: project.is_active !== undefined ? Boolean(project.is_active) : true,
        contact_phone: project.contact_details?.phone || '',
        contact_email: project.contact_details?.email || ''
      });

      // Set main image preview
      if (project.main_image) {
        setMainImagePreview(`http://localhost:8000/storage/${project.main_image}`);
      }

      // Set gallery images
      setGalleryImages(project.images || []);

      // Set features
      setFeatures(project.features || []);

      // Set floor plans
      setFloorPlans(project.floor_plans || []);

      // Set payment plans
      setPaymentPlans(project.payment_plans || []);

      showToast('Project data loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading project:', error);
      showToast('Error loading project data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFloorPlanImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFloorPlan({ ...newFloorPlan, image: file });
      setFloorPlanImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveBasic = async () => {
    setSaving(true);
    const data = new FormData();
    
    console.log('Saving with form data:', formData);
    
    // Append all form fields
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('status', formData.status);
    data.append('location', formData.location);
    data.append('starting_price', formData.starting_price || '');
    data.append('size_range', formData.size_range || '');
    data.append('total_units', formData.total_units || '');
    data.append('location_map', formData.location_map || '');
    
    // Convert booleans to 1 or 0 for Laravel
    data.append('is_featured', formData.is_featured ? '1' : '0');
    data.append('is_active', formData.is_active ? '1' : '0');

    // Add contact details as JSON
    const contactDetails = {
      phone: formData.contact_phone,
      email: formData.contact_email
    };
    data.append('contact_details', JSON.stringify(contactDetails));

    // Add main image if changed
    if (mainImage) {
      data.append('main_image', mainImage);
    }

    // For PUT requests, add _method field
    if (isEdit) {
      data.append('_method', 'PUT');
    }

    try {
      let response;
      if (isEdit) {
        console.log(`Updating project ${projectId}...`);
        // Use POST with _method=PUT for FormData
        response = await axios.post(`http://localhost:8000/api/projects/${projectId}`, data, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });
        showToast('Project updated successfully!', 'success');
        
        // Reload to get fresh data
        await loadProject();
      } else {
        console.log('Creating new project...');
        response = await axios.post('http://localhost:8000/api/projects', data, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });
        setProjectId(response.data.id);
        showToast('Project created successfully! You can now add gallery, features, etc.', 'success');
      }
      
      console.log('Response:', response.data);
      // Reload project data to get updated information
      if (isEdit) {
        await loadProject();
      } else {
        setProjectId(response.data.id);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error response:', error.response?.data);
      showToast(error.response?.data?.message || 'Error saving project. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGalleryImage = async (e) => {
    const files = Array.from(e.target.files);
    if (!projectId) {
      showToast('Please save basic info first', 'warning');
      return;
    }

    setSaving(true);
    try {
      for (const file of files) {
        const data = new FormData();
        data.append('image', file);
        data.append('caption', '');

        await axios.post(`http://localhost:8000/api/projects/${projectId}/images`, data);
      }
      showToast('Gallery images uploaded successfully!', 'success');
      await loadProject(); // Reload to get updated gallery
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      showToast('Error uploading images', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}/images/${imageId}`);
      showToast('Image deleted successfully', 'success');
      await loadProject(); // Reload to update gallery
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast('Error deleting image', 'error');
    }
  };

  const handleAddFeature = async () => {
    if (!projectId || !newFeature.name) {
      showToast('Please save project first and enter feature name', 'warning');
      return;
    }

    setSaving(true);
    try {
      await axios.post(`http://localhost:8000/api/projects/${projectId}/features`, {
        feature_name: newFeature.name,
        feature_value: newFeature.value,
        icon: newFeature.icon
      });
      setNewFeature({ name: '', value: '', icon: '' });
      showToast('Feature added successfully!', 'success');
      await loadProject(); // Reload to get updated features
    } catch (error) {
      console.error('Error adding feature:', error);
      showToast('Error adding feature', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}/features/${featureId}`);
      showToast('Feature deleted successfully', 'success');
      await loadProject(); // Reload to update features
    } catch (error) {
      console.error('Error deleting feature:', error);
      showToast('Error deleting feature', 'error');
    }
  };

  const handleAddFloorPlan = async () => {
    if (!projectId || !newFloorPlan.title || !newFloorPlan.image) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append('title', newFloorPlan.title);
    data.append('image', newFloorPlan.image);
    data.append('bedrooms', newFloorPlan.bedrooms);
    data.append('bathrooms', newFloorPlan.bathrooms);
    data.append('size', newFloorPlan.size);
    data.append('description', newFloorPlan.description);

    try {
      await axios.post(`http://localhost:8000/api/projects/${projectId}/floor-plans`, data);
      setNewFloorPlan({ title: '', bedrooms: '', bathrooms: '', size: '', description: '', image: null });
      setFloorPlanImagePreview('');
      showToast('Floor plan added successfully!', 'success');
      await loadProject(); // Reload to get updated floor plans
    } catch (error) {
      console.error('Error adding floor plan:', error);
      showToast('Error adding floor plan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFloorPlan = async (floorPlanId) => {
    if (!window.confirm('Are you sure you want to delete this floor plan?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}/floor-plans/${floorPlanId}`);
      showToast('Floor plan deleted successfully', 'success');
      await loadProject(); // Reload to update floor plans
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      showToast('Error deleting floor plan', 'error');
    }
  };

  const handleAddPaymentPlan = async () => {
    if (!projectId || !newPaymentPlan.plan_name) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    setSaving(true);
    try {
      await axios.post(`http://localhost:8000/api/projects/${projectId}/payment-plans`, newPaymentPlan);
      setNewPaymentPlan({ plan_name: '', down_payment: '', installments: '', details: {} });
      showToast('Payment plan added successfully!', 'success');
      await loadProject(); // Reload to get updated payment plans
    } catch (error) {
      console.error('Error adding payment plan:', error);
      showToast('Error adding payment plan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePaymentPlan = async (paymentPlanId) => {
    if (!window.confirm('Are you sure you want to delete this payment plan?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}/payment-plans/${paymentPlanId}`);
      showToast('Payment plan deleted successfully', 'success');
      await loadProject(); // Reload to update payment plans
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      showToast('Error deleting payment plan', 'error');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'features', label: 'Features' },
    { id: 'floorplans', label: 'Floor Plans' },
    { id: 'payment', label: 'Payment Plans' }
  ];

  if (loading && isEdit) {
    return (
      <div className="admin-project-form">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-project-form">
      <div className="form-header">
        <motion.button 
          className="back-btn" 
          onClick={() => navigate('/admin/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.button>
        <h1>{isEdit ? `Edit Project: ${formData.title}` : 'Add New Project'}</h1>
        {isEdit && projectData && (
          <div className="project-status-info">
            <span className={`status-badge status-${projectData.status}`}>
              {projectData.status}
            </span>
            {projectData.is_featured && (
              <span className="featured-badge">Featured</span>
            )}
          </div>
        )}
      </div>

      <div className="form-container">
        <div className="form-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
              {isEdit && (
                <span className="tab-count">
                  {tab.id === 'gallery' && galleryImages.length}
                  {tab.id === 'features' && features.length}
                  {tab.id === 'floorplans' && floorPlans.length}
                  {tab.id === 'payment' && paymentPlans.length}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="form-content">
          {activeTab === 'basic' && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key="basic"
            >
              <h2>Basic Information</h2>
              
              <div className="form-grid">
                <div className="form-group full">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Luxury Apartments DHA"
                  />
                </div>

                <div className="form-group full">
                  <label>Description *</label>
                  <textarea
                    rows="6"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed project description..."
                  />
                </div>

                <div className="form-group">
                  <label>Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., DHA Phase 8, Karachi"
                  />
                </div>

                <div className="form-group">
                  <label>Starting Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.starting_price}
                    onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
                    placeholder="e.g., 15000000"
                  />
                </div>

                <div className="form-group">
                  <label>Size Range</label>
                  <input
                    type="text"
                    value={formData.size_range}
                    onChange={(e) => setFormData({ ...formData, size_range: e.target.value })}
                    placeholder="e.g., 1200-2500 sq ft"
                  />
                </div>

                <div className="form-group">
                  <label>Total Units</label>
                  <input
                    type="number"
                    value={formData.total_units}
                    onChange={(e) => setFormData({ ...formData, total_units: e.target.value })}
                    placeholder="e.g., 120"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+92 21 1234 5678"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="info@chinagrouppk.com"
                  />
                </div>

                <div className="form-group full">
                  <label>Google Maps Embed Code (Optional)</label>
                  <textarea
                    rows="3"
                    value={formData.location_map}
                    onChange={(e) => setFormData({ ...formData, location_map: e.target.value })}
                    placeholder='<iframe src="..." ...></iframe>'
                  />
                </div>

                <div className="form-group full">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    Featured Project (Show on homepage)
                  </label>
                </div>

                <div className="form-group full">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    Active (Visible to public)
                  </label>
                </div>

                <div className="form-group full">
                  <label>Main Project Image *</label>
                  <div className="image-upload-area">
                    {mainImagePreview && (
                      <div className="image-preview-container">
                        <img src={mainImagePreview} alt="Preview" className="image-preview" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => {
                            setMainImage(null);
                            setMainImagePreview('');
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      id="main-image"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="main-image" className="upload-label">
                      <Upload size={24} />
                      {mainImagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    {isEdit && projectData?.main_image && !mainImagePreview && (
                      <div className="current-image-notice">
                        <p>Current image: {projectData.main_image}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <motion.button 
                className="btn btn-primary" 
                onClick={handleSaveBasic} 
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
              >
                <Save size={20} />
                {saving ? 'Saving...' : (isEdit ? 'Update Project' : 'Save Project')}
              </motion.button>

              {projectId && (
                <div className="project-id-info">
                  <p>Project ID: <strong>{projectId}</strong></p>
                  <p className="info-note">💡 Save basic info first, then you can add gallery images, features, floor plans, and payment plans using the tabs above.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key="gallery"
            >
              <h2>Gallery Images ({galleryImages.length})</h2>
              {!projectId ? (
                <div className="info-box">
                  <p>Please save basic info first before adding gallery images</p>
                </div>
              ) : (
                <>
                  <div className="upload-section">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddGalleryImage}
                      id="gallery-images"
                      style={{ display: 'none' }}
                      disabled={saving}
                    />
                    <label htmlFor="gallery-images" className={`btn btn-outline ${saving ? 'disabled' : ''}`}>
                      <ImageIcon size={20} />
                      {saving ? 'Uploading...' : 'Upload Gallery Images'}
                    </label>
                    <p className="upload-hint">You can select multiple images at once</p>
                  </div>

                  {galleryImages.length > 0 ? (
                    <div className="gallery-grid">
                      {galleryImages.map((img) => (
                        <motion.div 
                          key={img.id} 
                          className="gallery-item"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <img src={`http://localhost:8000/storage/${img.image_path}`} alt={`Gallery ${img.id}`} />
                          <button 
                            className="delete-gallery-image"
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            title="Delete image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-gallery">
                      <p>No gallery images yet. Upload some images to showcase your project.</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key="features"
            >
              <h2>Features & Amenities ({features.length})</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first</div>
              ) : (
                <>
                  <div className="add-item-form">
                    <h3>Add New Feature</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Feature Name (e.g., Swimming Pool)"
                          value={newFeature.name}
                          onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Value (e.g., Olympic Size)"
                          value={newFeature.value}
                          onChange={(e) => setNewFeature({ ...newFeature, value: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Emoji Icon (e.g., 🏊)"
                          value={newFeature.icon}
                          onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    <motion.button 
                      className="btn btn-primary" 
                      onClick={handleAddFeature}
                      disabled={saving || !newFeature.name}
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      <Plus size={20} />
                      {saving ? 'Adding...' : 'Add Feature'}
                    </motion.button>
                  </div>

                  {features.length > 0 ? (
                    <div className="items-list">
                      <h3>Current Features</h3>
                      {features.map((feature) => (
                        <motion.div 
                          key={feature.id} 
                          className="list-item"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="item-icon">{feature.icon || '✓'}</div>
                          <div className="item-content">
                            <strong>{feature.feature_name}</strong>
                            {feature.feature_value && <span>{feature.feature_value}</span>}
                          </div>
                          <button 
                            className="delete-item-btn"
                            onClick={() => handleDeleteFeature(feature.id)}
                            title="Delete feature"
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-features">
                      <p>No features added yet. Add some features to showcase your project's amenities.</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'floorplans' && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key="floorplans"
            >
              <h2>Floor Plans ({floorPlans.length})</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first</div>
              ) : (
                <>
                  <div className="add-item-form">
                    <h3>Add New Floor Plan</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Title (e.g., 2 Bedroom Apartment)"
                          value={newFloorPlan.title}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, title: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Bedrooms"
                          value={newFloorPlan.bedrooms}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, bedrooms: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Bathrooms"
                          value={newFloorPlan.bathrooms}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, bathrooms: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Size (e.g., 1400 sq ft)"
                          value={newFloorPlan.size}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, size: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group full">
                        <textarea
                          placeholder="Description"
                          value={newFloorPlan.description}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, description: e.target.value })}
                          disabled={saving}
                          rows="3"
                        />
                      </div>
                      <div className="form-group full">
                        <label>Floor Plan Image *</label>
                        <div className="image-upload-area small">
                          {floorPlanImagePreview && (
                            <div className="image-preview-container">
                              <img src={floorPlanImagePreview} alt="Preview" className="image-preview" />
                              <button 
                                type="button" 
                                className="remove-image-btn"
                                onClick={() => {
                                  setNewFloorPlan({ ...newFloorPlan, image: null });
                                  setFloorPlanImagePreview('');
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFloorPlanImageChange}
                            id="floorplan-image"
                            style={{ display: 'none' }}
                            disabled={saving}
                          />
                          <label htmlFor="floorplan-image" className="upload-label">
                            <Upload size={20} />
                            {floorPlanImagePreview ? 'Change Image' : 'Select Floor Plan Image'}
                          </label>
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      className="btn btn-primary" 
                      onClick={handleAddFloorPlan}
                      disabled={saving || !newFloorPlan.title || !newFloorPlan.image}
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      <Plus size={20} />
                      {saving ? 'Adding...' : 'Add Floor Plan'}
                    </motion.button>
                  </div>

                  {floorPlans.length > 0 ? (
                    <div className="floorplans-grid">
                      {floorPlans.map((plan) => (
                        <motion.div 
                          key={plan.id} 
                          className="floorplan-card"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="floorplan-image-container">
                            <img src={`http://localhost:8000/storage/${plan.image_path}`} alt={plan.title} />
                            <button 
                              className="delete-floorplan-btn"
                              onClick={() => handleDeleteFloorPlan(plan.id)}
                              title="Delete floor plan"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="floorplan-info">
                            <h4>{plan.title}</h4>
                            <div className="floorplan-specs">
                              {plan.bedrooms && <span>🛏️ {plan.bedrooms} Bed</span>}
                              {plan.bathrooms && <span>🚿 {plan.bathrooms} Bath</span>}
                              {plan.size && <span>📏 {plan.size}</span>}
                            </div>
                            {plan.description && <p>{plan.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-floorplans">
                      <p>No floor plans added yet. Add floor plans to showcase different unit layouts.</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'payment' && (
            <motion.div 
              className="tab-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key="payment"
            >
              <h2>Payment Plans ({paymentPlans.length})</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first</div>
              ) : (
                <>
                  <div className="add-item-form">
                    <h3>Add New Payment Plan</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Plan Name (e.g., Standard Plan)"
                          value={newPaymentPlan.plan_name}
                          onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, plan_name: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Down Payment (e.g., 20%)"
                          value={newPaymentPlan.down_payment}
                          onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, down_payment: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Installments (e.g., 36 Months)"
                          value={newPaymentPlan.installments}
                          onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, installments: e.target.value })}
                          disabled={saving}
                        />
                      </div>
                    </div>
                    <motion.button 
                      className="btn btn-primary" 
                      onClick={handleAddPaymentPlan}
                      disabled={saving || !newPaymentPlan.plan_name}
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      <Plus size={20} />
                      {saving ? 'Adding...' : 'Add Payment Plan'}
                    </motion.button>
                  </div>

                  {paymentPlans.length > 0 ? (
                    <div className="payment-plans-list">
                      {paymentPlans.map((plan) => (
                        <motion.div 
                          key={plan.id} 
                          className="payment-plan-card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="payment-plan-header">
                            <h4>{plan.plan_name}</h4>
                            <button 
                              className="delete-payment-plan-btn"
                              onClick={() => handleDeletePaymentPlan(plan.id)}
                              title="Delete payment plan"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="payment-details">
                            <p><strong>Down Payment:</strong> {plan.down_payment}</p>
                            <p><strong>Installments:</strong> {plan.installments}</p>
                            {plan.details && Object.keys(plan.details).length > 0 && (
                              <div className="additional-details">
                                <strong>Additional Details:</strong>
                                <ul>
                                  {Object.entries(plan.details).map(([key, value]) => (
                                    <li key={key}>{key}: {value}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-payment-plans">
                      <p>No payment plans added yet. Add payment plans to showcase financing options.</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjectForm;