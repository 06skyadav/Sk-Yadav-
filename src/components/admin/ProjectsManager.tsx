import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Star,
  Eye,
  ExternalLink,
  Github,
  Check,
  X,
  Sparkles,
  Save,
  Image as ImageIcon,
  Layers,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { Project } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onRefresh,
}) => {
  const { success, error, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const categories = ['All', 'Full Stack', 'Web Development', 'Business Website', 'E-Commerce', 'SaaS'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProject({
      name: '',
      slug: '',
      category: 'Full Stack',
      shortDescription: '',
      description: '',
      clientName: '',
      role: 'Full Stack Web Developer',
      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      features: ['Responsive UI', 'Secure Authentication'],
      challenges: '',
      solution: '',
      results: '',
      projectDuration: '4 Weeks',
      completionDate: new Date().getFullYear().toString(),
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'],
      liveUrl: 'https://',
      githubUrl: 'https://github.com',
      isFeatured: false,
      isPublished: true,
      viewsCount: 0,
    });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) {
      error('Project name is required.');
      return;
    }

    try {
      DatabaseStore.saveProject(editingProject as any);
      success(`Project "${editingProject.name}" saved successfully!`, 'Project Updated');
      setEditingProject(null);
      onRefresh();
    } catch (err: any) {
      error(err.message || 'Failed to save project.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      DatabaseStore.deleteProject(id);
      success(`Project "${name}" deleted.`, 'Project Removed');
      onRefresh();
    }
  };

  const handleDuplicate = (id: string) => {
    const copy = DatabaseStore.duplicateProject(id);
    if (copy) {
      success(`Created duplicate: "${copy.name}"`, 'Project Duplicated');
      onRefresh();
    }
  };

  const handleToggleFeature = (id: string) => {
    const isFeat = DatabaseStore.toggleProjectFeature(id);
    info(isFeat ? 'Marked as featured' : 'Removed from featured', 'Featured State');
    onRefresh();
  };

  const handleTogglePublish = (id: string) => {
    const isPub = DatabaseStore.toggleProjectPublish(id);
    info(isPub ? 'Project published' : 'Project unpublished (Draft)', 'Visibility State');
    onRefresh();
  };

  // Tag Helpers
  const addTech = () => {
    if (!techInput.trim() || !editingProject) return;
    const current = editingProject.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingProject({ ...editingProject, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: (editingProject.technologies || []).filter(t => t !== tech),
    });
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editingProject) return;
    const current = editingProject.features || [];
    setEditingProject({ ...editingProject, features: [...current, featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    if (!editingProject) return;
    const current = [...(editingProject.features || [])];
    current.splice(idx, 1);
    setEditingProject({ ...editingProject, features: current });
  };

  const addImage = () => {
    if (!imageInput.trim() || !editingProject) return;
    const current = editingProject.images || [];
    setEditingProject({ ...editingProject, images: [...current, imageInput.trim()] });
    setImageInput('');
  };

  const removeImage = (idx: number) => {
    if (!editingProject) return;
    const current = [...(editingProject.images || [])];
    current.splice(idx, 1);
    setEditingProject({ ...editingProject, images: current });
  };

  return (
    <div id="projects-manager-panel" className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            Portfolio Projects CMS ({projects.length})
          </h2>
          <p className="text-xs text-slate-400">
            Add, update, reorder, or publish case studies shown across your public portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description, tech stack..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              {/* Thumbnail header */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={proj.thumbnail || proj.images?.[0]}
                  alt={proj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(proj.id)}
                    title={proj.isFeatured ? 'Featured on Homepage' : 'Not Featured'}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                      proj.isFeatured
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(proj.id)}
                    title={proj.isPublished ? 'Published Live' : 'Draft Only'}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md ${
                      proj.isPublished
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-rose-500/80 text-white'
                    }`}
                  >
                    {proj.isPublished ? 'Live' : 'Draft'}
                  </button>
                </div>

                <div className="absolute bottom-2.5 left-2.5">
                  <span className="text-[10px] font-semibold bg-slate-950/80 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded-md">
                    {proj.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {proj.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Eye className="w-3 h-3" />
                    <span>{proj.viewsCount || 0}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {proj.shortDescription}
                </p>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.technologies.slice(0, 4).map(tech => (
                    <span
                      key={tech}
                      className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="text-[10px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">
                      +{proj.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                {proj.liveUrl && proj.liveUrl !== 'https://' && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Open Live Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Open GitHub Repo"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleDuplicate(proj.id)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800 transition-colors"
                  title="Duplicate Project"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProject(proj)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800 transition-colors"
                  title="Edit Project Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id, proj.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No projects found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search filters or add a new project.</p>
        </div>
      )}

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 sticky top-0 bg-slate-900 z-10">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProject.id ? `Edit Project: ${editingProject.name}` : 'Add New Portfolio Project'}
                </h3>
                <p className="text-xs text-slate-400">Configure case study metadata, gallery, and live links</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={editingProject.name || ''}
                    onChange={e => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProject({ ...editingProject, name, slug: editingProject.id ? editingProject.slug : slug });
                    }}
                    required
                    placeholder="e.g., VicharManch"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingProject.category || 'Full Stack'}
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Business Website">Business Website</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="SaaS">SaaS Platform</option>
                    <option value="PHP & MySQL">PHP & MySQL</option>
                    <option value="WordPress">WordPress</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Summary (Preview Card) *</label>
                <textarea
                  value={editingProject.shortDescription || ''}
                  onChange={e => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  rows={2}
                  required
                  placeholder="Concise 1-2 sentence overview of the project and impact..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Full Case Study Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Detailed Case Study Description</label>
                <textarea
                  value={editingProject.description || ''}
                  onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={4}
                  placeholder="In-depth project breakdown for the dedicated project detail page..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Metadata: Client, Role, Duration, Date */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Client / Org</label>
                  <input
                    type="text"
                    value={editingProject.clientName || ''}
                    onChange={e => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    placeholder="e.g. Sunrise Welfare"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">My Role</label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={e => setEditingProject({ ...editingProject, role: e.target.value })}
                    placeholder="e.g. Lead Developer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingProject.projectDuration || ''}
                    onChange={e => setEditingProject({ ...editingProject, projectDuration: e.target.value })}
                    placeholder="e.g. 4 Weeks"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.completionDate || ''}
                    onChange={e => setEditingProject({ ...editingProject, completionDate: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Technologies Tags Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technologies & Stack Used</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Type technology (e.g. Next.js, Redux, PostgreSQL) & press Add"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium rounded-xl"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editingProject.technologies || []).map(t => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-xs bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 px-2.5 py-1 rounded-lg"
                    >
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features Bullet List */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Key Features Delivered</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="Add bullet feature (e.g., WhatsApp quotation calculator)..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium rounded-xl"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(editingProject.features || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                    >
                      <span>• {feat}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-slate-500 hover:text-rose-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URLs: Live, GitHub, Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Live URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ''}
                    onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={editingProject.thumbnail || ''}
                    onChange={e => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured ?? false}
                    onChange={e => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-0 bg-slate-950 border-slate-800 w-4 h-4"
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished ?? true}
                    onChange={e => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-0 bg-slate-950 border-slate-800 w-4 h-4"
                  />
                  <span>Publish to Public Portfolio</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
