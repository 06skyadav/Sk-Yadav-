import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Heart,
  Eye,
  ArrowUpRight,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Project } from '../types';
import { DatabaseStore } from '../services/dbStore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ProjectCardProps {
  project: Project;
  onViewCaseStudy: (slug: string) => void;
  isBookmarkedInitial?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewCaseStudy,
  isBookmarkedInitial = false,
}) => {
  const { currentUser, openAuthModal, isLoggedIn } = useAuth();
  const { success, info } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      info('Please log in with OTP to save projects to your dashboard.', 'Login Required');
      openAuthModal();
      return;
    }
    const state = DatabaseStore.toggleBookmark(currentUser!.id, project.id);
    setIsBookmarked(state);
    if (state) {
      success(`Saved "${project.name}" to your Bookmarks.`, 'Project Saved');
    } else {
      info(`Removed "${project.name}" from your Bookmarks.`);
    }
  };

  const handleCardClick = () => {
    DatabaseStore.incrementProjectViews(project.id);
    onViewCaseStudy(project.slug);
  };

  return (
    <div
      id={`project-card-${project.slug}`}
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer"
    >
      {/* Thumbnail Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={project.thumbnail}
          alt={project.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl backdrop-blur-md transition-all pointer-events-auto cursor-pointer ${
              isBookmarked
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 border border-slate-800'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save to My Projects'}
            aria-label="Bookmark project"
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* View Count & Year */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Calendar className="w-3 h-3 text-slate-400" />
            {project.completionDate}
          </span>
          <span className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Eye className="w-3 h-3 text-indigo-400" />
            {project.viewsCount || 0} views
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors font-display">
              {project.name}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-indigo-400 font-mono">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Action Bottom Row */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={e => {
              e.stopPropagation();
              onViewCaseStudy(project.slug);
            }}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="View Source Code"
                aria-label="GitHub repository"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
