import React, { useState } from 'react';
import {
  Globe,
  Share2,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Eye,
  Sparkles
} from 'lucide-react';
import { SEOSettings, SocialLink } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface SEOSocialsManagerProps {
  seo: SEOSettings;
  socials: SocialLink[];
  onRefresh: () => void;
}

export const SEOSocialsManager: React.FC<SEOSocialsManagerProps> = ({
  seo: initialSeo,
  socials: initialSocials,
  onRefresh,
}) => {
  const { success, error } = useToast();
  const [seo, setSeo] = useState<SEOSettings>(initialSeo);
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);

  // Socials editor
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseStore.saveSEOSettings(seo);
    DatabaseStore.saveSocialLinks(socials);
    success('SEO configurations and social links saved!', 'SEO Updated');
    onRefresh();
  };

  const handleAddSocial = () => {
    if (!newPlatform.trim() || !newUrl.trim()) return;
    const newLink: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newPlatform.trim(),
      url: newUrl.trim(),
      icon: newPlatform.toLowerCase().includes('git') ? 'Github' : newPlatform.toLowerCase().includes('link') ? 'Linkedin' : newPlatform.toLowerCase().includes('what') ? 'Phone' : 'Globe',
      order: socials.length + 1,
      isActive: true,
    };
    setSocials([...socials, newLink]);
    setNewPlatform('');
    setNewUrl('');
  };

  const handleRemoveSocial = (id: string) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const handleToggleSocial = (id: string) => {
    setSocials(
      socials.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div id="seo-socials-manager" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            Search Engine Optimization (SEO) & Social Profiles
          </h2>
          <p className="text-xs text-slate-400">
            Configure OpenGraph social preview cards, meta descriptions, and verified contact channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSEO}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save SEO Settings</span>
        </button>
      </div>

      <form onSubmit={handleSaveSEO} className="space-y-6">
        {/* Google SERP Preview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Google Search Results Snippet Preview</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-mono truncate">{seo.canonicalUrl || 'https://skyadav.dev'}</p>
            <p className="text-sm font-semibold text-indigo-400 hover:underline cursor-pointer">
              {seo.metaTitle || 'SK Yadav — Full Stack Web Developer & Freelance Specialist'}
            </p>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {seo.metaDescription || 'Professional portfolio of SK Yadav, Full Stack Web Developer specializing in custom React, Node.js, and modern high-performance web applications.'}
            </p>
          </div>
        </div>

        {/* SEO Meta Fields */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Meta Tags & Search Metadata</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Meta Title (Tab Title)</label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={e => setSeo({ ...seo, metaTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description (150-160 characters recommended)</label>
            <textarea
              value={seo.metaDescription}
              onChange={e => setSeo({ ...seo, metaDescription: e.target.value })}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={seo.keywords}
                onChange={e => setSeo({ ...seo, keywords: e.target.value })}
                placeholder="freelance developer, full stack web developer, React developer..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">OpenGraph Social Banner Image URL</label>
              <input
                type="text"
                value={seo.ogImage || ''}
                onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links Manager */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Connected Social Links & Profiles</h3>

          <div className="space-y-2.5">
            {socials.map((soc, idx) => (
              <div
                key={soc.id}
                className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl"
              >
                <span className="text-xs font-bold text-white w-28">{soc.platform}</span>
                <input
                  type="text"
                  value={soc.url}
                  onChange={e => {
                    const updated = [...socials];
                    updated[idx].url = e.target.value;
                    setSocials(updated);
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleToggleSocial(soc.id)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    soc.isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {soc.isActive ? 'Active' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(soc.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Social Input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newPlatform}
              onChange={e => setNewPlatform(e.target.value)}
              placeholder="Platform (e.g. Twitter, YouTube, Behance)..."
              className="w-40 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddSocial}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Add Link
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
