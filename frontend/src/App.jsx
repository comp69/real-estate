import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetail from './components/ProjectDetail';
import VisionPage from './components/VisionPage';
import ContactPage from './components/ContactPage';

// Admin Components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminProjectForm from './components/AdminProjectForm';

import './App.css';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="app">
            <ScrollToTop />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/projects/new" element={<AdminProjectForm />} />
              <Route path="/admin/projects/edit/:id" element={<AdminProjectForm />} />

              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/projects/:slug" element={<ProjectDetail />} />
                      <Route path="/vision" element={<VisionPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                  </AnimatePresence>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;