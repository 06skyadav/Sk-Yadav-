import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  FileText,
  Heart,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  MessageSquare,
  Sparkles,
  User,
  Shield,
  ArrowRight,
  RefreshCw,
  XCircle,
  ChevronRight,
  Code2,
  Calendar,
  Lock,
  Layers,
  FileCheck,
  CheckSquare,
  KeyRound,
  Trash2
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateQuotationPDF } from '../utils/pdfGenerator';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectEnquiry, Quotation, Project, ClientProject } from '../types';

interface ClientDashboardPageProps {
  initialTab?: string;
  prefilledService?: string;
  onNavigate: (tab: string, slug?: string) => void;
}

export const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({
  initialTab = 'projects',
  prefilledService = '',
  onNavigate
}) => {
  const {
    currentUser,
    isLoggedIn,
    openAuthModal,
    updateProfile,
    changePassword,
    deleteAccount,
    logout
  } = useAuth();
  const { success, error, info } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<
    'projects' | 'quotations' | 'enquiries' | 'saved' | 'new-enquiry' | 'profile'
  >(
    initialTab === 'new-enquiry'
      ? 'new-enquiry'
      : initialTab === 'quotations'
      ? 'quotations'
      : 'projects'
  );

  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);

  // New enquiry form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(prefilledService || 'Full Stack Web Application');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState('$1,000 - $3,000');
  const [newTimeline, setNewTimeline] = useState('2 - 4 Weeks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profileJobTitle, setProfileJobTitle] = useState('');
  const [profileLocation, setProfileLocation] = useState('');

  // Password Change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const loadData = () => {
    if (!currentUser) return;
    const userProjects = DatabaseStore.getClientProjects(currentUser.id, currentUser.email);
    setClientProjects(userProjects);
    if (userProjects.length > 0 && !selectedProject) {
      setSelectedProject(userProjects[0]);
    }

    const userEnqs = DatabaseStore.getUserEnquiries(currentUser.id, currentUser.email);
    setEnquiries(userEnqs);

    const userQuotes = DatabaseStore.getUserQuotations(currentUser.id, currentUser.email);
    setQuotations(userQuotes);

    const bookmarkedIds = currentUser.savedProjectIds || [];
    const allProj = DatabaseStore.getProjects();
    const filteredSaved = allProj.filter(p => bookmarkedIds.includes(p.id));
    setSavedProjects(filteredSaved);

    setProfileName(currentUser.name || '');
    setProfilePhone(currentUser.phone || '');
    setProfileCompany(currentUser.company || '');
    setProfileJobTitle(currentUser.jobTitle || '');
    setProfileLocation(currentUser.location || '');
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (prefilledService) {
      setNewCategory(prefilledService);
      setActiveSubTab('new-enquiry');
    }
  }, [prefilledService]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
          <FolderKanban className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Client Portal Access</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Log in to submit project requests, track your active development milestones, review itemized quotations, and download official documents.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Sign In to Portal</span>
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      error('Please fill in both project title and details.');
      return;
    }

    setIsSubmitting(true);
    const newEnq: ProjectEnquiry = {
      id: `enq-${Date.now()}`,
      userId: currentUser!.id,
      name: currentUser!.name || 'Client',
      email: currentUser!.email,
      phone: currentUser!.phone || '',
      projectTitle: newTitle.trim(),
      serviceCategory: newCategory,
      projectDescription: newDescription.trim(),
      budgetRange: newBudget,
      preferredTimeline: newTimeline,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };

    DatabaseStore.saveEnquiry(newEnq);
    setIsSubmitting(false);
    success('Project requirement submitted successfully!', 'Enquiry Created');
    setNewTitle('');
    setNewDescription('');
    setActiveSubTab('enquiries');
    loadData();
  };

  const handleAcceptQuote = (quote: Quotation) => {
    DatabaseStore.updateQuotationStatus(quote.id, 'Accepted');
    success(`Quotation ${quote.quotationNumber} accepted. SK Yadav will commence work!`);
    loadData();
  };

  const handleRejectQuote = (quote: Quotation) => {
    DatabaseStore.updateQuotationStatus(quote.id, 'Rejected');
    info(`Quotation ${quote.quotationNumber} marked as rejected.`);
    loadData();
  };

  const handleDownloadPDF = (quote: Quotation) => {
    try {
      const currentSettings = DatabaseStore.getSettings();
      generateQuotationPDF(quote, currentSettings);
      success(`Downloaded quotation ${quote.quotationNumber} PDF`);
    } catch (e: any) {
      error('Failed to generate PDF document.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      company: profileCompany.trim(),
      jobTitle: profileJobTitle.trim(),
      location: profileLocation.trim()
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      error('Please enter your current and new password.');
      return;
    }
    if (newPass.length < 6) {
      error('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmNewPass) {
      error('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPass, newPass);
    setIsChangingPass(false);
    if (res.success) {
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (window.confirm('Are you sure you want to delete your client account? Your submitted quotations and project history will be safely archived.')) {
      await deleteAccount();
      onNavigate('home');
    }
  };

  return (
    <div id="client-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/30 shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Welcome, {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold">
                  Client Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.email} {currentUser.company ? `• ${currentUser.company}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('new-enquiry')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request New Project Quote</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Projects ({clientProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quotations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'quotations'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations & Invoices ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('enquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'enquiries'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Requirements / Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('new-enquiry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'new-enquiry'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Quote Request</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Projects ({savedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* 1. ACTIVE CLIENT PROJECTS TAB */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6">
          {clientProjects.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Active Projects Yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  When you accept a project proposal with SK Yadav, your development roadmap, milestones, and live deliverables will appear here.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('new-enquiry')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start Your First Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project List Sidebar */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Your Projects ({clientProjects.length})
                </h3>
                {clientProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedProject?.id === proj.id
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{proj.projectName}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : proj.status === 'In Progress'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{proj.description}</p>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Progress</span>
                        <span className="font-bold text-white">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Project Full Details */}
              {selectedProject && (
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
                    {/* Project Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                            {selectedProject.projectName}
                          </h2>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              selectedProject.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}
                          >
                            {selectedProject.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Assigned Lead Engineer: <strong className="text-slate-200">{selectedProject.assignedDeveloper || 'SK Yadav'}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400">Target Completion</span>
                        <p className="text-sm font-semibold text-indigo-400">{selectedProject.expectedCompletion || 'Upcoming'}</p>
                      </div>
                    </div>

                    {/* Overall Progress Gauge */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">Overall Milestone Execution</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Technology Stack Pills */}
                    {selectedProject.technology && selectedProject.technology.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Architecture & Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.technology.map(tech => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestone Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                        <span>Development Milestones</span>
                      </h4>

                      <div className="space-y-2.5">
                        {selectedProject.milestones?.map((milestone, idx) => (
                          <div
                            key={milestone.id}
                            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                              milestone.status === 'completed' || milestone.completed
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                                : milestone.status === 'in_progress'
                                ? 'bg-indigo-950/30 border-indigo-500/40 text-slate-100'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {milestone.status === 'completed' || milestone.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : milestone.status === 'in_progress' ? (
                                <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-600" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-semibold">{milestone.title}</p>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                                  {milestone.status === 'completed' || milestone.completed
                                    ? 'Completed'
                                    : milestone.status === 'in_progress'
                                    ? 'In Progress'
                                    : 'Pending'}
                                </span>
                              </div>
                              {milestone.dueDate && (
                                <p className="text-[10px] text-slate-500 mt-0.5">Target: {milestone.dueDate}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Developer Updates Timeline */}
                    {selectedProject.recentUpdates && selectedProject.recentUpdates.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                          <span>Activity Log & Engineer Updates</span>
                        </h4>

                        <div className="divide-y divide-slate-800/60 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                          {selectedProject.recentUpdates.map(up => (
                            <div key={up.id} className="pt-3 first:pt-0 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-white">{up.title}</span>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(up.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">{up.message}</p>
                              <span className="text-[10px] text-indigo-400 font-medium">— {up.author || 'SK Yadav'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. QUOTATIONS & INVOICES TAB */}
      {activeSubTab === 'quotations' && (
        <div className="space-y-6">
          {quotations.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Quotations Issued Yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Submit a project requirement to receive a transparent, itemized quotation with timeline estimates.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('new-enquiry')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Requirements</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotations.map(quote => (
                <div
                  key={quote.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 shadow-xl hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[11px] font-mono text-indigo-400 font-bold">
                        {quote.quotationNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{quote.projectTitle}</h4>
                      <p className="text-xs text-slate-400">
                        Date: {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        quote.status === 'Accepted'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : quote.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Itemized Scope
                    </span>
                    <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-950 border border-slate-800/80 p-3 space-y-2">
                      {quote.items.map((item, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                          <span className="text-slate-300">{item.description}</span>
                          <span className="font-mono font-semibold text-white">${item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                    <span className="font-semibold text-slate-400">Grand Total</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      ${quote.total.toLocaleString()} {quote.currency}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleDownloadPDF(quote)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-indigo-400" />
                      <span>Download PDF</span>
                    </button>

                    {quote.status === 'Draft' || quote.status === 'Sent' ? (
                      <>
                        <button
                          onClick={() => handleAcceptQuote(quote)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectQuote(quote)}
                          className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ENQUIRIES / REQUIREMENTS TAB */}
      {activeSubTab === 'enquiries' && (
        <div className="space-y-6">
          {enquiries.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Submitted Requirements</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Have an app, website, or API idea? Submit your specifications to start discussing with SK Yadav.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('new-enquiry')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Requirement</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map(enq => (
                <div
                  key={enq.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-white">{enq.projectTitle}</h4>
                      <p className="text-xs text-indigo-400">{enq.serviceCategory}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          enq.status === 'In Progress'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : enq.status === 'Quoted'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {enq.projectDescription}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
                    <div>
                      Budget: <strong className="text-white">{enq.budgetRange}</strong>
                    </div>
                    <div>
                      Timeline: <strong className="text-white">{enq.preferredTimeline}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. NEW ENQUIRY FORM */}
      {activeSubTab === 'new-enquiry' && (
        <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white font-display">Submit New Project Requirement</h3>
            <p className="text-xs text-slate-400">
              Provide project details to receive a customized scope, timeline, and itemized quotation.
            </p>
          </div>

          <form onSubmit={handleCreateEnquiry} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Custom CRM & Client Portal"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Service Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Full Stack Web Application</option>
                  <option>MERN Stack Development</option>
                  <option>PHP & MySQL Web System</option>
                  <option>E-commerce Store Development</option>
                  <option>WordPress / WooCommerce</option>
                  <option>API & Integration</option>
                  <option>Performance Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget Range</label>
                <select
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>&lt; $500</option>
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $3,000</option>
                  <option>$3,000 - $5,000+</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Timeline</label>
              <select
                value={newTimeline}
                onChange={e => setNewTimeline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option>Urgent (&lt; 1 Week)</option>
                <option>1 - 2 Weeks</option>
                <option>2 - 4 Weeks</option>
                <option>1 - 2 Months</option>
                <option>Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Scope & Specifications <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Explain feature requirements, user roles, database architecture, design preferences..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Submit Project Requirement</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. SAVED PROJECTS TAB */}
      {activeSubTab === 'saved' && (
        <div className="space-y-6">
          {savedProjects.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Saved Projects Yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Browse SK Yadav's portfolio projects and bookmark items you like to reference in your future discussions.
                </p>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                <FolderKanban className="w-4 h-4" />
                <span>Explore Portfolio Projects</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewCaseStudy={slug => onNavigate('project-detail', slug)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. ACCOUNT PROFILE & SETTINGS TAB */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Profile Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display">Personal Details</h3>
              <p className="text-xs text-slate-400">
                Update your contact details for quotation generation and project agreements.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  placeholder="+1 555-019-2834"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company</label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={e => setProfileCompany(e.target.value)}
                    placeholder="Nexus Inc"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Title</label>
                  <input
                    type="text"
                    value={profileJobTitle}
                    onChange={e => setProfileJobTitle(e.target.value)}
                    placeholder="CTO"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Password & Security Card */}
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-display">Change Password</h3>
                <p className="text-xs text-slate-400">Update your account password for secure login.</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmNewPass}
                    onChange={e => setConfirmNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Account Actions */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Sign Out of Portal</h4>
                <p className="text-[11px] text-slate-400">Safely terminate your active session</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
