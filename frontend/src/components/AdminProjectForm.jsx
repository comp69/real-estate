import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Plus, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import './AdminProjectForm.css';

const AdminProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(id);

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

  const loadProject = () => {
    // Load project data for editing
    axios.get(`http://localhost:8000/api/projects/${id}`)
      .then(res => {
        const project = res.data;
        setFormData({
          title: project.title,
          description: project.description,
          type: project.type,
          status: project.status,
          location: project.location,
          starting_price: project.starting_price,
          size_range: project.size_range || '',
          total_units: project.total_units || '',
          location_map: project.location_map || '',
          is_featured: project.is_featured,
          contact_phone: project.contact_details?.phone || '',
          contact_email: project.contact_details?.email || ''
        });
        setMainImagePreview(`http://localhost:8000/storage/${project.main_image}`);
        setFeatures(project.features || []);
        setFloorPlans(project.floor_plans || []);
        setPaymentPlans(project.payment_plans || []);
      })
      .catch(err => console.error(err));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveBasic = async () => {
    setLoading(true);
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'contact_phone' || key === 'contact_email') return;
      data.append(key, formData[key]);
    });

    // Add contact details as JSON
    data.append('contact_details', JSON.stringify({
      phone: formData.contact_phone,
      email: formData.contact_email
    }));

    if (mainImage) {
      data.append('main_image', mainImage);
    }

    try {
      let response;
      if (isEdit) {
        response = await axios.post(`http://localhost:8000/api/projects/${projectId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://localhost:8000/api/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProjectId(response.data.id);
      }
      alert('Project saved successfully!');
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Error saving project');
      setLoading(false);
    }
  };

  const handleAddGalleryImage = async (e) => {
    const files = Array.from(e.target.files);
    if (!projectId) {
      alert('Please save basic info first');
      return;
    }

    for (const file of files) {
      const data = new FormData();
      data.append('image', file);
      data.append('caption', '');

      try {
        await axios.post(`http://localhost:8000/api/projects/${projectId}/images`, data);
      } catch (error) {
        console.error(error);
      }
    }
    alert('Images uploaded!');
    loadProject();
  };

  const handleAddFeature = async () => {
    if (!projectId || !newFeature.name) {
      alert('Please save project first and enter feature name');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/projects/${projectId}/features`, {
        feature_name: newFeature.name,
        feature_value: newFeature.value,
        icon: newFeature.icon
      });
      setNewFeature({ name: '', value: '', icon: '' });
      loadProject();
    } catch (error) {
      console.error(error);
      alert('Error adding feature');
    }
  };

  const handleAddFloorPlan = async () => {
    if (!projectId || !newFloorPlan.title || !newFloorPlan.image) {
      alert('Please save project first and fill required fields');
      return;
    }

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
      loadProject();
    } catch (error) {
      console.error(error);
      alert('Error adding floor plan');
    }
  };

  const handleAddPaymentPlan = async () => {
    if (!projectId || !newPaymentPlan.plan_name) {
      alert('Please save project first and enter plan name');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/api/projects/${projectId}/payment-plans`, newPaymentPlan);
      setNewPaymentPlan({ plan_name: '', down_payment: '', installments: '', details: {} });
      loadProject();
    } catch (error) {
      console.error(error);
      alert('Error adding payment plan');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'features', label: 'Features' },
    { id: 'floorplans', label: 'Floor Plans' },
    { id: 'payment', label: 'Payment Plans' }
  ];

  return (
    <div className="admin-project-form">
      <div className="form-header">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
      </div>

      <div className="form-container">
        <div className="form-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="form-content">
          {activeTab === 'basic' && (
            <div className="tab-panel">
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
                    rows="4"
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
                  <label>Starting Price</label>
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
                  <label>Main Project Image *</label>
                  <div className="image-upload-area">
                    {mainImagePreview && (
                      <img src={mainImagePreview} alt="Preview" className="image-preview" />
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
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSaveBasic} disabled={loading}>
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="tab-panel">
              <h2>Gallery Images</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first before adding gallery images</div>
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
                    />
                    <label htmlFor="gallery-images" className="btn btn-outline">
                      <ImageIcon size={20} />
                      Upload Gallery Images
                    </label>
                  </div>

                  <div className="gallery-grid">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="gallery-item">
                        <img src={`http://localhost:8000/storage/${img.image_path}`} alt="" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="tab-panel">
              <h2>Features & Amenities</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first</div>
              ) : (
                <>
                  <div className="add-item-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Feature Name (e.g., Swimming Pool)"
                          value={newFeature.name}
                          onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Value (e.g., Olympic Size)"
                          value={newFeature.value}
                          onChange={(e) => setNewFeature({ ...newFeature, value: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Emoji Icon (e.g., 🏊)"
                          value={newFeature.icon}
                          onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddFeature}>
                      <Plus size={20} />
                      Add Feature
                    </button>
                  </div>

                  <div className="items-list">
                    {features.map((feature) => (
                      <div key={feature.id} className="list-item">
                        <div className="item-icon">{feature.icon || '✓'}</div>
                        <div className="item-content">
                          <strong>{feature.feature_name}</strong>
                          {feature.feature_value && <span>{feature.feature_value}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'floorplans' && (
            <div className="tab-panel">
              <h2>Floor Plans</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first</div>
              ) : (
                <>
                  <div className="add-item-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Title (e.g., 2 Bedroom Apartment)"
                          value={newFloorPlan.title}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Bedrooms"
                          value={newFloorPlan.bedrooms}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, bedrooms: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Bathrooms"
                          value={newFloorPlan.bathrooms}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, bathrooms: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Size (e.g., 1400 sq ft)"
                          value={newFloorPlan.size}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, size: e.target.value })}
                        />
                      </div>
                      <div className="form-group full">
                        <textarea
                          placeholder="Description"
                          value={newFloorPlan.description}
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, description: e.target.value })}
                        />
                      </div>
                      <div className="form-group full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewFloorPlan({ ...newFloorPlan, image: e.target.files[0] })}
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddFloorPlan}>
                      <Plus size={20} />
                      Add Floor Plan
                    </button>
                  </div>

                  <div className="floorplans-grid">
                    {floorPlans.map((plan) => (
                      <div key={plan.id} className="floorplan-card">
                        <img src={`http://localhost:8000/storage/${plan.image_path}`} alt={plan.title} />
                        <div className="floorplan-info">
                          <h4>{plan.title}</h4>
                          <p>{plan.bedrooms} Bed • {plan.bathrooms} Bath • {plan.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="tab-panel">
              <h2>Payment Plans</h2>
              {!projectId ? (
                <div className="info-box">Please save basic info first</div>
              ) : (
                <>
                  <div className="add-item-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Plan Name (e.g., Standard Plan)"
                          value={newPaymentPlan.plan_name}
                          onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, plan_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Down Payment (e.g., 20%)"
                          value={newPaymentPlan.down_payment}
                          onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, down_payment: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Installments (e.g., 36 Months)"
                          value={newPaymentPlan.installments}
                          onChange={(e) => setNewPaymentPlan({ ...newPaymentPlan, installments: e.target.value })}
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddPaymentPlan}>
                      <Plus size={20} />
                      Add Payment Plan
                    </button>
                  </div>

                  <div className="payment-plans-list">
                    {paymentPlans.map((plan) => (
                      <div key={plan.id} className="payment-plan-card">
                        <h4>{plan.plan_name}</h4>
                        <div className="payment-details">
                          <p><strong>Down Payment:</strong> {plan.down_payment}</p>
                          <p><strong>Installments:</strong> {plan.installments}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjectForm;