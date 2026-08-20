import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseStore } from './services/dbStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { ContactPage } from './pages/ContactPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function PortfolioApp() {
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    if (hash === 'admin' || pathname === '/admin' || hash === 'admin/login') return 'admin';
    if (hash === 'login' || pathname === '/login') return 'login';
    if (hash === 'signup' || pathname === '/signup') return 'signup';
    if (['home', 'projects', 'services', 'about', 'blog', 'contact', 'dashboard'].includes(hash)) return hash;
    return 'home';
  });
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [activeParam, setActiveParam] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [settings, setSettings] = useState(DatabaseStore.getSettings());

  useEffect(() => {
    setSettings(DatabaseStore.getSettings());

    // Update Browser Tab Title
    const titleMap: Record<string, string> = {
      home: 'SK Yadav — Full Stack Web Developer',
      projects: 'Projects — SK Yadav',
      'project-detail': 'Project Case Study — SK Yadav',
      services: 'Services & Pricing — SK Yadav',
      about: 'About — SK Yadav',
      blog: 'Tech Blog — SK Yadav',
      'blog-detail': 'Article — SK Yadav',
      contact: 'Contact & Hire — SK Yadav',
      dashboard: 'Client Dashboard — SK Yadav',
      admin: 'Admin CMS — SK Yadav',
      login: 'Client Login — SK Yadav',
      signup: 'Create Client Account — SK Yadav',
    };
    document.title = titleMap[currentTab] || 'SK Yadav — Full Stack Web Developer';
  }, [currentTab]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, slugOrParam?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'project-detail' && slugOrParam) {
      setActiveSlug(slugOrParam);
      setCurrentTab('project-detail');
    } else if (tab === 'blog-detail' && slugOrParam) {
      setActiveSlug(slugOrParam);
      setCurrentTab('blog-detail');
    } else if (tab === 'dashboard') {
      setActiveParam(slugOrParam || '');
      setCurrentTab('dashboard');
    } else {
      setActiveSlug('');
      setActiveParam('');
      setCurrentTab(tab);
    }
  };

  const isStandaloneAdminOrAuth = currentTab === 'admin' || currentTab === 'login' || currentTab === 'signup';

  return (
    <div
      id="portfolio-app-root"
      className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Global Navbar */}
      {!isStandaloneAdminOrAuth && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Main Page Render View */}
      <main id="main-content" className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            settings={settings}
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'services' && (
          <ServicesPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsPage
            onViewCaseStudy={slug => handleNavigate('project-detail', slug)}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'project-detail' && (
          <ProjectDetailPage
            slug={activeSlug}
            onBack={() => handleNavigate('projects')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'blog' && (
          <BlogPage
            onSelectPost={slug => handleNavigate('blog-detail', slug)}
          />
        )}

        {currentTab === 'blog-detail' && (
          <BlogPostDetailPage
            slug={activeSlug}
            onBack={() => handleNavigate('blog')}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'dashboard' && (
          <ClientDashboardPage
            initialTab={activeParam ? 'new-enquiry' : 'projects'}
            prefilledService={activeParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateSignup={() => handleNavigate('signup')}
            onLoginSuccess={(role) => {
              if (role === 'admin') {
                handleNavigate('admin');
              } else {
                handleNavigate('dashboard');
              }
            }}
          />
        )}

        {currentTab === 'signup' && (
          <SignupPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateLogin={() => handleNavigate('login')}
            onSignupSuccess={() => handleNavigate('dashboard')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage onNavigateHome={() => handleNavigate('home')} />
        )}
      </main>

      {/* Global Footer */}
      {!isStandaloneAdminOrAuth && (
        <Footer
          settings={settings}
          setCurrentTab={handleNavigate}
        />
      )}

      {/* AI Assistant Chatbot */}
      {!isStandaloneAdminOrAuth && (
        <AIChatbot
          settings={settings}
          onNavigate={handleNavigate}
        />
      )}

      {/* WhatsApp Quick Chat */}
      {!isStandaloneAdminOrAuth && <WhatsAppFloatingButton settings={settings} />}

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={slug => handleNavigate('project-detail', slug)}
        onSelectService={() => handleNavigate('services')}
        onSelectBlog={slug => handleNavigate('blog-detail', slug)}
        onSelectContact={() => handleNavigate('contact')}
      />

      {/* Client Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PortfolioApp />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
