import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Layers,
  FolderCode,
  BookOpen,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { Project, Service, BlogPost, Skill } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (slug: string) => void;
  onSelectService: () => void;
  onSelectBlog: (slug: string) => void;
  onSelectContact: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onSelectService,
  onSelectBlog,
  onSelectContact
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const projects = DatabaseStore.getProjects();
  const services = DatabaseStore.getServices();
  const blogs = DatabaseStore.getBlogPosts();
  const skills = DatabaseStore.getSkills();

  const q = query.toLowerCase().trim();

  const matchedProjects = q
    ? projects.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.technologies.some(t => t.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q)
      )
    : projects.slice(0, 3);

  const matchedServices = q
    ? services.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.technologies.some(t => t.toLowerCase().includes(q))
      )
    : services.slice(0, 3);

  const matchedBlogs = q
    ? blogs.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tags.some(t => t.toLowerCase().includes(q))
      )
    : blogs.slice(0, 2);

  const matchedSkills = q
    ? skills.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    : [];

  return (
    <div
      id="search-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="search-modal-card"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects (VicharManch, Sunrise), stacks (React, PHP, MERN), services, blogs..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded-md border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Projects Results */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                <FolderCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Projects ({matchedProjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.slug);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={proj.thumbnail}
                        alt={proj.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 truncate">
                            {proj.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {proj.technologies.slice(0, 4).join(' • ')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Results */}
          {matchedServices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Services ({matchedServices.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedServices.map(serv => (
                  <div
                    key={serv.id}
                    onClick={() => {
                      onSelectService();
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-slate-950/60 hover:bg-purple-950/30 border border-slate-800/80 hover:border-purple-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-white group-hover:text-purple-300">
                        {serv.title}
                      </h4>
                      {serv.startingPrice && (
                        <span className="text-[11px] font-bold text-emerald-400">{serv.startingPrice}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{serv.shortDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Matches */}
          {matchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Skills</span>
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {matchedSkills.map(sk => (
                  <span
                    key={sk.id}
                    className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-indigo-300 font-medium"
                  >
                    {sk.name} ({sk.proficiency}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Blog Articles */}
          {matchedBlogs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Articles & Guides ({matchedBlogs.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedBlogs.map(blog => (
                  <div
                    key={blog.id}
                    onClick={() => {
                      onSelectBlog(blog.slug);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-slate-950/60 hover:bg-blue-950/30 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all group"
                  >
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300">
                      {blog.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{blog.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedProjects.length === 0 && matchedServices.length === 0 && matchedBlogs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-slate-400">No exact results found for "{query}".</p>
              <button
                onClick={() => {
                  onSelectContact();
                  onClose();
                }}
                className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Ask SK Yadav directly about custom requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
