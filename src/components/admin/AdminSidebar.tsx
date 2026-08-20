import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Sparkles,
  MessageSquareQuote,
  HelpCircle,
  Users,
  Inbox,
  FileSpreadsheet,
  Building2,
  Mail,
  FileCode,
  Globe,
  Bot,
  Image as ImageIcon,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type AdminTabType =
  | 'overview'
  | 'projects'
  | 'services'
  | 'skills'
  | 'testimonials'
  | 'faqs'
  | 'leads'
  | 'enquiries'
  | 'quotes'
  | 'clients'
  | 'messages'
  | 'content'
  | 'seo'
  | 'chatbot'
  | 'media'
  | 'security';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  counts: {
    projects: number;
    leads: number;
    enquiries: number;
    quotes: number;
    messages: number;
  };
  onLogout: () => void;
  onPreviewSite: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  counts,
  onLogout,
  onPreviewSite,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const navGroups = [
    {
      group: 'Core Management',
      items: [
        { id: 'overview' as AdminTabType, label: 'Overview & KPIs', icon: LayoutDashboard },
        { id: 'projects' as AdminTabType, label: 'Portfolio Projects', icon: FolderKanban, count: counts.projects },
        { id: 'services' as AdminTabType, label: 'Services', icon: Wrench },
        { id: 'skills' as AdminTabType, label: 'Skills & Stack', icon: Sparkles },
      ],
    },
    {
      group: 'CRM & Pipeline',
      items: [
        { id: 'leads' as AdminTabType, label: 'Leads CRM', icon: Users, badge: counts.leads, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'enquiries' as AdminTabType, label: 'Project Enquiries', icon: Inbox, badge: counts.enquiries, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'quotes' as AdminTabType, label: 'Quotations & Invoices', icon: FileSpreadsheet, count: counts.quotes },
        { id: 'clients' as AdminTabType, label: 'Client Directory', icon: Building2 },
        { id: 'messages' as AdminTabType, label: 'Contact Messages', icon: Mail, badge: counts.messages, badgeColor: 'bg-amber-500/20 text-amber-300' },
      ],
    },
    {
      group: 'Content & Trust',
      items: [
        { id: 'content' as AdminTabType, label: 'Homepage Content CMS', icon: FileCode },
        { id: 'testimonials' as AdminTabType, label: 'Client Testimonials', icon: MessageSquareQuote },
        { id: 'faqs' as AdminTabType, label: 'FAQ Database', icon: HelpCircle },
      ],
    },
    {
      group: 'System & Intelligence',
      items: [
        { id: 'seo' as AdminTabType, label: 'SEO & Socials', icon: Globe },
        { id: 'chatbot' as AdminTabType, label: 'AI Chatbot Rules', icon: Bot },
        { id: 'media' as AdminTabType, label: 'Media Library', icon: ImageIcon },
        { id: 'security' as AdminTabType, label: 'Security & Backups', icon: ShieldAlert },
      ],
    },
  ];

  return (
    <aside
      id="admin-sidebar"
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                SK
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">CMS Backoffice</h2>
                <p className="text-[11px] text-slate-400">SK Yadav Portfolio</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mx-auto shadow">
              SK
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
          {navGroups.map(group => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.group}
                </p>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && !item.badge && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / User & Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-900/50">
        <button
          type="button"
          onClick={onPreviewSite}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Preview Live Site"
        >
          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          {!collapsed && <span>View Public Website</span>}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out Admin</span>}
        </button>
      </div>
    </aside>
  );
};
