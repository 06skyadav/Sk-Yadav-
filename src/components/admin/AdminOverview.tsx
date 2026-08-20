import React from 'react';
import {
  FolderKanban,
  Users,
  Inbox,
  FileSpreadsheet,
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Sparkles,
  Clock,
  ExternalLink,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { AdminTabType } from './AdminSidebar';
import { Project, Lead, Enquiry, Quote, ActivityLog } from '../../types';

interface AdminOverviewProps {
  projects: Project[];
  leads: Lead[];
  enquiries: Enquiry[];
  quotes: Quote[];
  logs: ActivityLog[];
  setActiveTab: (tab: AdminTabType) => void;
  onExportBackup: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  projects,
  leads,
  enquiries,
  quotes,
  logs,
  setActiveTab,
  onExportBackup,
}) => {
  const totalViews = projects.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalQuotedValue = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
  const activeEnquiriesCount = enquiries.filter(e => e.status !== 'Completed' && e.status !== 'Archived').length;
  const newLeadsCount = leads.filter(l => l.status === 'New' || l.status === 'Requirement Discussion').length;

  return (
    <div id="admin-overview-panel" className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Production CMS
            </span>
            <span className="text-xs text-slate-500">• Single Source of Truth Active</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Portfolio Management & CMS Center
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Control portfolio projects, homepage copy, leads, client quotes, and AI chatbot behavior in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <button
            type="button"
            onClick={onExportBackup}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Backup JSON</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-950"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quotation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Portfolio Projects</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{projects.length}</span>
            <span className="text-xs text-slate-500">
              ({projects.filter(p => p.isFeatured).length} featured)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className="mt-3 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            Manage Projects <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Leads Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{leads.length}</span>
            <span className="text-xs text-emerald-400 font-medium">{newLeadsCount} active</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            Open CRM Pipeline <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Project Enquiries</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{enquiries.length}</span>
            <span className="text-xs text-cyan-400 font-medium">{activeEnquiriesCount} in progress</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className="mt-3 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            View Enquiries Inbox <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Quoted Value</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">${totalQuotedValue.toLocaleString()}</span>
            <span className="text-xs text-slate-500">({quotes.length} quotations)</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            Manage Quotations <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Quick Operations & CMS Shortcuts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <FolderKanban className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white">Add Project</p>
            <p className="text-[10px] text-slate-500">Case studies & media</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <Sparkles className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white">Edit Homepage</p>
            <p className="text-[10px] text-slate-500">Hero copy & workflow</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <Users className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white">Record Lead</p>
            <p className="text-[10px] text-slate-500">Track incoming client</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chatbot')}
            className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <MessageSquare className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white">Chatbot Rules</p>
            <p className="text-[10px] text-slate-500">Prompt & FAQs knowledge</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <TrendingUp className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white">SEO & Socials</p>
            <p className="text-[10px] text-slate-500">Meta tags & OG cards</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <ShieldCheck className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-white">Security & Logs</p>
            <p className="text-[10px] text-slate-500">Audit trail & password</p>
          </button>
        </div>
      </div>

      {/* Two-Column: Recent Enquiries & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Project Enquiries</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className="text-xs text-indigo-400 hover:underline"
            >
              View All ({enquiries.length})
            </button>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 4).map(enq => (
              <div
                key={enq.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {enq.clientName || enq.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {enq.projectTitle || enq.projectType} • Budget: {enq.budget || enq.budgetRange}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    enq.status === 'New'
                      ? 'bg-amber-500/20 text-amber-300'
                      : enq.status === 'Quoted'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {enq.status}
                </span>
              </div>
            ))}
            {enquiries.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No enquiries received yet.</p>
            )}
          </div>
        </div>

        {/* Real-time Activity Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">System Audit & Activity Trail</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Full Logs
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(0, 4).map(log => (
              <div
                key={log.id}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-300">{log.action}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] truncate">
                  <span className="text-slate-300 font-medium">[{log.entity}]</span> {log.details}
                </p>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No activity logs recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
