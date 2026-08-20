import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DatabaseStore } from '../services/dbStore';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminSidebar, AdminTabType } from '../components/admin/AdminSidebar';
import { AdminOverview } from '../components/admin/AdminOverview';
import { ProjectsManager } from '../components/admin/ProjectsManager';
import { ServicesSkillsManager } from '../components/admin/ServicesSkillsManager';
import { TestimonialsFaqsManager } from '../components/admin/TestimonialsFaqsManager';
import { LeadsEnquiriesManager } from '../components/admin/LeadsEnquiriesManager';
import { QuotesClientsManager } from '../components/admin/QuotesClientsManager';
import { MessagesManager } from '../components/admin/MessagesManager';
import { WebsiteContentManager } from '../components/admin/WebsiteContentManager';
import { SEOSocialsManager } from '../components/admin/SEOSocialsManager';
import { MediaChatbotSecurityManager } from '../components/admin/MediaChatbotSecurityManager';

import {
  Project,
  Lead,
  Enquiry,
  Quote,
  ClientRecord,
  ContactMessage,
  Service,
  Skill,
  Testimonial,
  FAQItem,
  WebsiteContent,
  SiteSettings,
  SEOSettings,
  SocialLink,
  ChatbotConfig,
  AdminSecurity,
  ActivityLog,
  MediaItem
} from '../types';

interface AdminDashboardPageProps {
  onNavigateHome?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome = () => window.location.href = '/'
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');
  const [prefilledQuote, setPrefilledQuote] = useState<Partial<Quote> | null>(null);

  // Loaded database state
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [content, setContent] = useState<WebsiteContent>(DatabaseStore.getWebsiteContent());
  const [settings, setSettings] = useState<SiteSettings>(DatabaseStore.getSettings());
  const [seo, setSeo] = useState<SEOSettings>(DatabaseStore.getSEOSettings());
  const [socials, setSocials] = useState<SocialLink[]>(DatabaseStore.getSocialLinks());
  const [chatbot, setChatbot] = useState<ChatbotConfig>(DatabaseStore.getChatbotConfig());
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [security, setSecurity] = useState<AdminSecurity>(DatabaseStore.getAdminSecurity());
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const reloadAllData = () => {
    setProjects(DatabaseStore.getProjects());
    setLeads(DatabaseStore.getLeads());
    setEnquiries(DatabaseStore.getEnquiries());
    setQuotes(DatabaseStore.getQuotations());
    setClients(DatabaseStore.getClients());
    setMessages(DatabaseStore.getContactMessages());
    setServices(DatabaseStore.getServices());
    setSkills(DatabaseStore.getSkills());
    setTestimonials(DatabaseStore.getTestimonials());
    setFaqs(DatabaseStore.getFAQs());
    setContent(DatabaseStore.getWebsiteContent());
    setSettings(DatabaseStore.getSettings());
    setSeo(DatabaseStore.getSEOSettings());
    setSocials(DatabaseStore.getSocialLinks());
    setChatbot(DatabaseStore.getChatbotConfig());
    setMedia(DatabaseStore.getMediaItems());
    setSecurity(DatabaseStore.getAdminSecurity());
    setLogs(DatabaseStore.getActivityLogs());
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  const handleExportBackup = () => {
    const data = DatabaseStore.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skyadav-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('Database backup JSON exported successfully.');
  };

  const handleNavigateToQuotesWithPrefill = (prefillData: any) => {
    setPrefilledQuote({
      clientName: prefillData.clientName || '',
      clientEmail: prefillData.clientEmail || '',
      clientPhone: prefillData.clientPhone || '',
      projectTitle: prefillData.projectTitle || 'Web Application Development',
      currency: 'USD',
      items: [
        { description: 'Full Stack Architecture & Design', quantity: 1, rate: 450, amount: 450 },
        { description: 'Database & API Integration', quantity: 1, rate: 400, amount: 400 },
      ],
      subtotal: 850,
      taxRate: 0,
      tax: 0,
      discount: 0,
      total: 850,
      status: 'Draft',
    });
    setActiveTab('quotes');
  };

  // If user is logged in as a normal client, show Access Denied
  if (currentUser && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-400">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-slate-400 mb-6">
            Administrator privileges are required to access the SK Yadav Content Management System. You are currently logged in as a client (<strong>{currentUser.email}</strong>).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => (window.location.hash = 'dashboard')}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Go to Client Dashboard
            </button>
            <button
              onClick={onNavigateHome}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in, show secure Admin Login
  if (!isAdmin) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          reloadAllData();
        }}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const newLeadsCount = leads.filter(l => l.status === 'New' || l.status === 'Requirement Discussion').length;

  return (
    <div id="admin-cms-layout" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        counts={{
          projects: projects.length,
          leads: newLeadsCount,
          enquiries: newEnquiriesCount,
          quotes: quotes.length,
          messages: unreadMessagesCount,
        }}
        onLogout={logout}
        onPreviewSite={onNavigateHome}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <AdminOverview
              projects={projects}
              leads={leads}
              enquiries={enquiries}
              quotes={quotes}
              logs={logs}
              setActiveTab={setActiveTab}
              onExportBackup={handleExportBackup}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsManager
              projects={projects}
              onRefresh={reloadAllData}
            />
          )}

          {activeTab === 'services' && (
            <ServicesSkillsManager
              services={services}
              skills={skills}
              onRefresh={reloadAllData}
              defaultSubTab="services"
            />
          )}

          {activeTab === 'skills' && (
            <ServicesSkillsManager
              services={services}
              skills={skills}
              onRefresh={reloadAllData}
              defaultSubTab="skills"
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsFaqsManager
              testimonials={testimonials}
              faqs={faqs}
              onRefresh={reloadAllData}
              defaultSubTab="testimonials"
            />
          )}

          {activeTab === 'faqs' && (
            <TestimonialsFaqsManager
              testimonials={testimonials}
              faqs={faqs}
              onRefresh={reloadAllData}
              defaultSubTab="faqs"
            />
          )}

          {activeTab === 'leads' && (
            <LeadsEnquiriesManager
              leads={leads}
              enquiries={enquiries}
              onRefresh={reloadAllData}
              defaultSubTab="leads"
              onNavigateToQuotes={handleNavigateToQuotesWithPrefill}
            />
          )}

          {activeTab === 'enquiries' && (
            <LeadsEnquiriesManager
              leads={leads}
              enquiries={enquiries}
              onRefresh={reloadAllData}
              defaultSubTab="enquiries"
              onNavigateToQuotes={handleNavigateToQuotesWithPrefill}
            />
          )}

          {activeTab === 'quotes' && (
            <QuotesClientsManager
              quotes={quotes}
              clients={clients}
              settings={settings}
              onRefresh={reloadAllData}
              defaultSubTab="quotes"
              prefilledQuote={prefilledQuote}
            />
          )}

          {activeTab === 'clients' && (
            <QuotesClientsManager
              quotes={quotes}
              clients={clients}
              settings={settings}
              onRefresh={reloadAllData}
              defaultSubTab="clients"
            />
          )}

          {activeTab === 'messages' && (
            <MessagesManager
              messages={messages}
              onRefresh={reloadAllData}
            />
          )}

          {activeTab === 'content' && (
            <WebsiteContentManager
              content={content}
              settings={settings}
              onRefresh={reloadAllData}
            />
          )}

          {activeTab === 'seo' && (
            <SEOSocialsManager
              seo={seo}
              socials={socials}
              onRefresh={reloadAllData}
            />
          )}

          {activeTab === 'chatbot' && (
            <MediaChatbotSecurityManager
              chatbot={chatbot}
              media={media}
              security={security}
              logs={logs}
              onRefresh={reloadAllData}
              defaultSubTab="chatbot"
            />
          )}

          {activeTab === 'media' && (
            <MediaChatbotSecurityManager
              chatbot={chatbot}
              media={media}
              security={security}
              logs={logs}
              onRefresh={reloadAllData}
              defaultSubTab="media"
            />
          )}

          {activeTab === 'security' && (
            <MediaChatbotSecurityManager
              chatbot={chatbot}
              media={media}
              security={security}
              logs={logs}
              onRefresh={reloadAllData}
              defaultSubTab="security"
            />
          )}
        </div>
      </div>
    </div>
  );
};
