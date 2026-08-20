import React, { useState } from 'react';
import {
  Bot,
  Image as ImageIcon,
  ShieldAlert,
  Save,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  KeyRound,
  Download,
  Upload,
  Clock,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { ChatbotConfig, MediaItem, AdminSecurity, ActivityLog } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface MediaChatbotSecurityManagerProps {
  chatbot: ChatbotConfig;
  media: MediaItem[];
  security: AdminSecurity;
  logs: ActivityLog[];
  onRefresh: () => void;
  defaultSubTab?: 'chatbot' | 'media' | 'security';
}

export const MediaChatbotSecurityManager: React.FC<MediaChatbotSecurityManagerProps> = ({
  chatbot: initialChatbot,
  media,
  security: initialSecurity,
  logs,
  onRefresh,
  defaultSubTab = 'chatbot'
}) => {
  const { success, error, info } = useToast();
  const [subTab, setSubTab] = useState<'chatbot' | 'media' | 'security'>(defaultSubTab);

  // Chatbot state
  const [chatbot, setChatbot] = useState<ChatbotConfig>(initialChatbot);
  const [newPrompt, setNewPrompt] = useState('');

  // Media state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'Project' | 'Service' | 'Profile' | 'Certificate' | 'Other'>('Project');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(initialSecurity.sessionTimeoutMinutes || 120);

  // Chatbot Actions
  const handleSaveChatbot = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseStore.saveChatbotConfig(chatbot);
    success('AI Chatbot directives and prompt knowledge updated!', 'Chatbot Synced');
    onRefresh();
  };

  const handleAddPrompt = () => {
    if (!newPrompt.trim()) return;
    setChatbot({
      ...chatbot,
      suggestedQuestions: [...chatbot.suggestedQuestions, newPrompt.trim()],
    });
    setNewPrompt('');
  };

  const handleRemovePrompt = (idx: number) => {
    const updated = [...chatbot.suggestedQuestions];
    updated.splice(idx, 1);
    setChatbot({ ...chatbot, suggestedQuestions: updated });
  };

  // Media Actions
  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim() || !newMediaUrl.trim()) {
      error('Title and URL are required.');
      return;
    }
    DatabaseStore.saveMediaItem({
      title: newMediaTitle.trim(),
      url: newMediaUrl.trim(),
      category: newMediaCategory,
      altText: newMediaTitle.trim(),
      size: 'Web Optimized',
    });
    success(`Media "${newMediaTitle}" added to library!`);
    setNewMediaTitle('');
    setNewMediaUrl('');
    onRefresh();
  };

  const handleDeleteMedia = (id: string) => {
    DatabaseStore.deleteMediaItem(id);
    success('Media item removed.');
    onRefresh();
  };

  const handleCopyMediaUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    info('Image URL copied to clipboard!', 'Copied');
  };

  // Security Actions
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('New passwords do not match.');
      return;
    }

    const res = DatabaseStore.updateAdminPassword(currentPassword, newPassword);
    if (res.success) {
      success(res.message, 'Password Changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onRefresh();
    } else {
      error(res.message, 'Authentication Error');
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Clear all system audit activity logs?')) {
      DatabaseStore.clearActivityLogs();
      success('Audit logs cleared.');
      onRefresh();
    }
  };

  const handleExportBackup = () => {
    const data = DatabaseStore.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skyadav-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('System database exported to JSON file!', 'Backup Complete');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const res = DatabaseStore.importData(json);
        if (res.success) {
          success(res.message, 'Data Restored');
          onRefresh();
        } else {
          error(res.message, 'Import Failed');
        }
      } catch (err: any) {
        error('Invalid JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="media-chatbot-security-manager" className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
        <button
          type="button"
          onClick={() => setSubTab('chatbot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            subTab === 'chatbot' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Chatbot Rules</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('media')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            subTab === 'media' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Media Library ({media.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            subTab === 'security' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Security & Backups</span>
        </button>
      </div>

      {/* CHATBOT RULES */}
      {subTab === 'chatbot' && (
        <form onSubmit={handleSaveChatbot} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">AI Assistant Personality & Directives</h3>
                <p className="text-xs text-slate-400">
                  Control how the Gemini-powered virtual assistant responds to clients on your portfolio.
                </p>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-950"
              >
                <Save className="w-4 h-4" />
                <span>Save Chatbot Rules</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={chatbot.botName}
                  onChange={e => setChatbot({ ...chatbot, botName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fallback WhatsApp Number</label>
                <input
                  type="text"
                  value={chatbot.fallbackWhatsApp}
                  onChange={e => setChatbot({ ...chatbot, fallbackWhatsApp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Welcome Greeting Message</label>
              <textarea
                value={chatbot.welcomeMessage}
                onChange={e => setChatbot({ ...chatbot, welcomeMessage: e.target.value })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custom System Instructions & Knowledge Directives</label>
              <textarea
                value={chatbot.customInstructions}
                onChange={e => setChatbot({ ...chatbot, customInstructions: e.target.value })}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed font-mono"
              />
            </div>

            {/* Suggested Prompts */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quick Suggested Prompt Chips</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPrompt(); } }}
                  placeholder="e.g. Can you build an E-Commerce portal in MERN stack?"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddPrompt}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add Chip
                </button>
              </div>

              <div className="space-y-1.5">
                {chatbot.suggestedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                  >
                    <span>"{q}"</span>
                    <button type="button" onClick={() => handleRemovePrompt(idx)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* MEDIA LIBRARY */}
      {subTab === 'media' && (
        <div className="space-y-6">
          {/* Add Media Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-3">Add Asset to Media Library</h3>
            <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={newMediaTitle}
                onChange={e => setNewMediaTitle(e.target.value)}
                placeholder="Asset Title..."
                required
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={newMediaUrl}
                onChange={e => setNewMediaUrl(e.target.value)}
                placeholder="Image URL (https://...)..."
                required
                className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Asset</span>
              </button>
            </form>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map(item => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="aspect-video bg-slate-950 overflow-hidden relative">
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-slate-950/80 text-indigo-300 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{item.url}</p>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleCopyMediaUrl(item.url)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECURITY & BACKUPS */}
      {subTab === 'security' && (
        <div className="space-y-6">
          {/* Password & Credential Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Current Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new strong password..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'} Password</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* System Backup & Restore */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Full System Backup & Restore</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Export your entire database (projects, quotes, leads, CMS copy, and security logs) as a single JSON file or restore from a previous backup.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Complete JSON Backup</span>
                  </button>

                  <label className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>Restore Database From JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-500">
                Data is protected with client-side atomic validation and timestamp verification.
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-white">System Audit Trail ({logs.length})</h3>
              </div>
              <button
                type="button"
                onClick={handleClearLogs}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {logs.slice(0, 15).map(l => (
                    <tr key={l.id} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold text-indigo-300">{l.action}</td>
                      <td className="p-3 text-slate-400">{l.entity}</td>
                      <td className="p-3 text-slate-300 font-sans">{l.details}</td>
                      <td className="p-3 text-slate-500">{l.ipAddress || '127.0.0.1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
