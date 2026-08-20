import React, { useState } from 'react';
import {
  FileCode,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  Plus,
  Trash2
} from 'lucide-react';
import { WebsiteContent, SiteSettings } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface WebsiteContentManagerProps {
  content: WebsiteContent;
  settings: SiteSettings;
  onRefresh: () => void;
}

export const WebsiteContentManager: React.FC<WebsiteContentManagerProps> = ({
  content: initialContent,
  settings: initialSettings,
  onRefresh,
}) => {
  const { success, info } = useToast();
  const [content, setContent] = useState<WebsiteContent>(initialContent);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'why' | 'workflow' | 'cta' | 'contact'>('hero');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseStore.saveWebsiteContent(content);
    DatabaseStore.saveSettings(settings);
    success('Website copy and settings updated successfully! Public pages are synced in real-time.', 'CMS Content Saved');
    onRefresh();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset editable copy to default portfolio texts?')) {
      DatabaseStore.init(true);
      setContent(DatabaseStore.getWebsiteContent());
      setSettings(DatabaseStore.getSettings());
      info('Content reset to standard defaults.');
      onRefresh();
    }
  };

  return (
    <div id="website-content-manager" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            Homepage Content CMS
          </h2>
          <p className="text-xs text-slate-400">
            Control all visible text, headlines, stats, workflow steps, and contact points without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'hero', label: 'Hero & Stat Counters' },
          { id: 'about', label: 'About & Bio Copy' },
          { id: 'why', label: 'Why Hire Me (4 Points)' },
          { id: 'workflow', label: '7-Step Workflow' },
          { id: 'cta', label: 'CTA Banners' },
          { id: 'contact', label: 'Official Contact Info' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* HERO SECTION */}
        {activeSection === 'hero' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Hero Section Headlines & Stats</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Badge</label>
                <input
                  type="text"
                  value={content.hero.badgeText}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, badgeText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
                <input
                  type="text"
                  value={content.hero.availability}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, availability: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title Line 1</label>
                <input
                  type="text"
                  value={content.hero.titleLine1}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, titleLine1: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title Line 2</label>
                <input
                  type="text"
                  value={content.hero.titleLine2}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, titleLine2: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Highlighted Dynamic Word</label>
                <input
                  type="text"
                  value={content.hero.highlightedWord}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, highlightedWord: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-indigo-400 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subtitle Paragraph</label>
              <textarea
                value={content.hero.subtitle}
                onChange={e => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Button CTA</label>
                <input
                  type="text"
                  value={content.hero.primaryCtaText}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, primaryCtaText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Button CTA</label>
                <input
                  type="text"
                  value={content.hero.secondaryCtaText}
                  onChange={e => setContent({ ...content, hero: { ...content.hero, secondaryCtaText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Key Credibility Stats
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Experience Years</label>
                  <input
                    type="text"
                    value={content.hero.experienceYears}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, experienceYears: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Completed Projects</label>
                  <input
                    type="text"
                    value={content.hero.completedProjects}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, completedProjects: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Happy Clients</label>
                  <input
                    type="text"
                    value={content.hero.happyClients}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, happyClients: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Client Rating</label>
                  <input
                    type="text"
                    value={content.hero.rating}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, rating: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT SECTION */}
        {activeSection === 'about' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">About & Professional Bio</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
              <input
                type="text"
                value={content.about.sectionTitle}
                onChange={e => setContent({ ...content, about: { ...content.about, sectionTitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bio Paragraph 1</label>
              <textarea
                value={content.about.bioParagraph1}
                onChange={e => setContent({ ...content, about: { ...content.about, bioParagraph1: e.target.value } })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bio Paragraph 2</label>
              <textarea
                value={content.about.bioParagraph2}
                onChange={e => setContent({ ...content, about: { ...content.about, bioParagraph2: e.target.value } })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Key Strengths (Comma Separated)</label>
              <input
                type="text"
                value={content.about.bulletPoints.join(', ')}
                onChange={e => setContent({ ...content, about: { ...content.about, bulletPoints: e.target.value.split(',').map(s => s.trim()) } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* WHY HIRE ME */}
        {activeSection === 'why' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Why Hire Me (4 Differentiator Cards)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.whyHireMe.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Card #{idx + 1}</span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const updated = [...content.whyHireMe];
                      updated[idx].title = e.target.value;
                      setContent({ ...content, whyHireMe: updated });
                    }}
                    placeholder="Card title..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold"
                  />
                  <textarea
                    value={item.description}
                    onChange={e => {
                      const updated = [...content.whyHireMe];
                      updated[idx].description = e.target.value;
                      setContent({ ...content, whyHireMe: updated });
                    }}
                    rows={2}
                    placeholder="Card description..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-STEP WORKFLOW */}
        {activeSection === 'workflow' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">7-Step Transparent Client Workflow</h3>

            <div className="space-y-3">
              {content.workflowSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={step.title}
                      onChange={e => {
                        const updated = [...content.workflowSteps];
                        updated[idx].title = e.target.value;
                        setContent({ ...content, workflowSteps: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
                    />
                    <input
                      type="text"
                      value={step.timeframe}
                      onChange={e => {
                        const updated = [...content.workflowSteps];
                        updated[idx].timeframe = e.target.value;
                        setContent({ ...content, workflowSteps: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-indigo-400 font-mono"
                    />
                    <input
                      type="text"
                      value={step.description}
                      onChange={e => {
                        const updated = [...content.workflowSteps];
                        updated[idx].description = e.target.value;
                        setContent({ ...content, workflowSteps: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA BANNERS */}
        {activeSection === 'cta' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Bottom Call to Action Banner Copy</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
              <input
                type="text"
                value={content.ctaSection.title}
                onChange={e => setContent({ ...content, ctaSection: { ...content.ctaSection, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
              <textarea
                value={content.ctaSection.subtitle}
                onChange={e => setContent({ ...content, ctaSection: { ...content.ctaSection, subtitle: e.target.value } })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                <input
                  type="text"
                  value={content.ctaSection.buttonText}
                  onChange={e => setContent({ ...content, ctaSection: { ...content.ctaSection, buttonText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Guaranteed Response Time</label>
                <input
                  type="text"
                  value={content.ctaSection.guaranteeText}
                  onChange={e => setContent({ ...content, ctaSection: { ...content.ctaSection, guaranteeText: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL CONTACT INFO */}
        {activeSection === 'contact' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Official Contact Information</h3>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Single Source of Truth
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp & Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={e => {
                      const phone = e.target.value;
                      const rawNum = phone.replace(/\D/g, '');
                      setSettings({ ...settings, phone, whatsappNumber: rawNum });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Timezone</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.location || 'Gurugram / Delhi NCR, India (IST UTC+5:30)'}
                    onChange={e => setSettings({ ...settings, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Working / Response Hours</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.workingHours || 'Mon - Sat: 9:00 AM - 9:00 PM IST'}
                    onChange={e => setSettings({ ...settings, workingHours: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button in view */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-950 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Content Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
