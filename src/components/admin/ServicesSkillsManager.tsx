import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  DollarSign,
  Clock,
  Save,
  Layers,
  Star
} from 'lucide-react';
import { Service, Skill } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface ServicesSkillsManagerProps {
  services: Service[];
  skills: Skill[];
  onRefresh: () => void;
  defaultSubTab?: 'services' | 'skills';
}

export const ServicesSkillsManager: React.FC<ServicesSkillsManagerProps> = ({
  services,
  skills,
  onRefresh,
  defaultSubTab = 'services'
}) => {
  const { success, error, info } = useToast();
  const [subTab, setSubTab] = useState<'services' | 'skills'>(defaultSubTab);

  // Service editing state
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  // Skill editing state
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  // Service Actions
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) {
      error('Service title is required.');
      return;
    }
    DatabaseStore.saveService(editingService as any);
    success(`Service "${editingService.title}" saved.`, 'Service Saved');
    setEditingService(null);
    onRefresh();
  };

  const handleDeleteService = (id: string, title: string) => {
    if (window.confirm(`Delete service "${title}"?`)) {
      DatabaseStore.deleteService(id);
      success(`Service "${title}" deleted.`);
      onRefresh();
    }
  };

  // Skill Actions
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name) {
      error('Skill name is required.');
      return;
    }
    DatabaseStore.saveSkill(editingSkill as any);
    success(`Skill "${editingSkill.name}" saved.`, 'Skill Saved');
    setEditingSkill(null);
    onRefresh();
  };

  const handleDeleteSkill = (id: string, name: string) => {
    if (window.confirm(`Delete skill "${name}"?`)) {
      DatabaseStore.deleteSkill(id);
      success(`Skill "${name}" deleted.`);
      onRefresh();
    }
  };

  const skillCategories = ['Frontend', 'Backend', 'Database', 'CMS & Frameworks', 'Tools & DevOps'];

  return (
    <div id="services-skills-manager" className="space-y-6">
      {/* Sub Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'services'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Services & Pricing ({services.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('skills')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'skills'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Skills & Tech Stack ({skills.length})</span>
          </button>
        </div>

        {subTab === 'services' ? (
          <button
            type="button"
            onClick={() =>
              setEditingService({
                title: '',
                slug: '',
                icon: 'Globe',
                shortDescription: '',
                description: '',
                features: ['Custom Design', 'Mobile Responsive', 'SEO Optimization'],
                technologies: ['React', 'Tailwind CSS'],
                startingPrice: '$299',
                deliveryDays: '1-2 Weeks',
                isPopular: false,
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setEditingSkill({
                name: '',
                category: 'Frontend',
                proficiency: 90,
                iconName: 'Code',
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        )}
      </div>

      {/* Services List View */}
      {subTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(serv => (
            <div
              key={serv.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors relative"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{serv.title}</h3>
                    <p className="text-[11px] text-indigo-400 font-mono">
                      Starting {serv.startingPrice || 'On Quote'} • {serv.deliveryDays || 'Flexible'}
                    </p>
                  </div>
                  {serv.isPopular && (
                    <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {serv.shortDescription || serv.description}
                </p>

                <div className="space-y-1 mb-4">
                  {serv.features?.slice(0, 3).map((f, i) => (
                    <p key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{f}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setEditingService(serv)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteService(serv.id, serv.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills View */}
      {subTab === 'skills' && (
        <div className="space-y-6">
          {skillCategories.map(cat => {
            const catSkills = skills.filter(s => s.category === cat || (!skillCategories.includes(s.category) && cat === 'Tools & DevOps'));
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {cat} ({catSkills.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catSkills.map(sk => (
                    <div
                      key={sk.id}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white truncate">{sk.name}</span>
                          <span className="text-[11px] text-indigo-400 font-mono font-bold">
                            {sk.proficiency}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${sk.proficiency}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingSkill(sk)}
                          className="p-1 text-slate-400 hover:text-indigo-400 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(sk.id, sk.name)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button type="button" onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={editingService.title || ''}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  required
                  placeholder="e.g. MERN Stack Web Applications"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Price</label>
                  <input
                    type="text"
                    value={editingService.startingPrice || ''}
                    onChange={e => setEditingService({ ...editingService, startingPrice: e.target.value })}
                    placeholder="e.g. $450"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={editingService.deliveryDays || ''}
                    onChange={e => setEditingService({ ...editingService, deliveryDays: e.target.value })}
                    placeholder="e.g. 2-3 Weeks"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={editingService.shortDescription || ''}
                  onChange={e => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  rows={2}
                  placeholder="Summary of what is included in this service..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular-toggle"
                  checked={editingService.isPopular ?? false}
                  onChange={e => setEditingService({ ...editingService, isPopular: e.target.checked })}
                  className="rounded text-indigo-600 bg-slate-950 border-slate-800"
                />
                <label htmlFor="popular-toggle" className="text-xs text-slate-300 cursor-pointer">
                  Mark as Popular / Most Requested Service
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button type="button" onClick={() => setEditingSkill(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  value={editingSkill.name || ''}
                  onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  required
                  placeholder="e.g. React.js, TypeScript, PostgreSQL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={editingSkill.category || 'Frontend'}
                  onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  {skillCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Proficiency Level</label>
                  <span className="text-xs font-mono font-bold text-indigo-400">{editingSkill.proficiency || 85}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={editingSkill.proficiency || 85}
                  onChange={e => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
