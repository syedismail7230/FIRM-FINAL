import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPortal } from './pages/AdminPortal';
import { UserDashboard } from './components/UserDashboard';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CookiesPage } from './pages/CookiesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AuthModal } from './components/AuthModal';
import { Building2, BarChart as ChartBar, BarChart } from 'lucide-react';

function App() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.email === 'super_admin@example.com';

  useEffect(() => {
    // Simulate loading time for boot animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // if (loading) {
  //   return (
  //     <div className="boot-animation">
  //       <div className="boot-animation__logo">
  //         <div className="boot-animation__circle"></div>
  //         <div className="boot-animation__icon">
  //           <Building2 className="w-16 h-16" />
  //           <ChartBar className="w-8 h-8 absolute -top-2 -right-2" />
  //           <BarChart className="w-8 h-8 absolute -bottom-2 -left-2" />
  //         </div>
  //         <div className="boot-animation__text">
  //           Firm AI
  //         </div>
  //         <div className="boot-animation__progress">
  //           <div className="boot-animation__progress-bar"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onSignInClick={() => setShowAuthModal(true)} />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              user ? (
                <ProfilePage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Home Route - Redirects to appropriate dashboard */}
          <Route
            path="/"
            element={
              user ? (
                isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <UserDashboard user={user} />
                )
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Business Location Analyzer
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Sign in to access powerful business location analysis tools and insights.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              user && isAdmin ? (
                <AdminPortal user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;