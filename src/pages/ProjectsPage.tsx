import React, { useState } from 'react';
import {
  FolderCode,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCategory, Project } from '../types';

interface ProjectsPageProps {
  onViewCaseStudy: (slug: string) => void;
  onNavigate: (tab: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onViewCaseStudy, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = DatabaseStore.getProjects();

  const categories: ProjectCategory[] = [
    'All',
    'Full Stack',
    'Web Development',
    'Business Website',
    'E-commerce',
    'PHP',
    'MERN',
    'WordPress',
  ];

  const filteredProjects = projects.filter(p => {
    if (!p.isPublished) return false;
    const matchesCat =
      selectedCategory === 'All' ||
      p.category === selectedCategory ||
      p.technologies.some(t => t.toLowerCase() === selectedCategory.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div id="projects-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <FolderCode className="w-3.5 h-3.5" />
          <span>Case Studies & Live Platforms</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Featured Web Development Portfolio
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Explore real-world platforms built by SK Yadav. Every project reflects high visual polish, clean architecture, and business conversion goals.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/70 border border-slate-800">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by tech, title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <p className="text-sm text-slate-400">No projects found matching the selected criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs text-indigo-400 font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewCaseStudy={onViewCaseStudy}
            />
          ))}
        </div>
      )}

      {/* Hire Me CTA Section */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/70 to-purple-950/60 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
          Have a similar web project in mind?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Let's discuss your requirements, prepare an itemized quotation, and build a high-performance solution for your business.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Start Your Project With SK Yadav
        </button>
      </div>
    </div>
  );
};
