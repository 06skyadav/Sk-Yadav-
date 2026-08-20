import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  User,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Heart,
  Share2,
  FolderCode
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { ProjectCard } from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Project } from '../types';

interface ProjectDetailPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (tab: string, slug?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onBack, onNavigate }) => {
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>('');
  const { currentUser, isLoggedIn, openAuthModal } = useAuth();
  const { success, info } = useToast();

  useEffect(() => {
    const p = DatabaseStore.getProjectBySlug(slug);
    if (p) {
      setProject(p);
      setActiveImage(p.thumbnail || (p.images && p.images[0]) || '');
      DatabaseStore.incrementProjectViews(p.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-display">Case Study Not Found</h2>
        <p className="text-sm text-slate-400">The requested project could not be found.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const allProjects = DatabaseStore.getProjects();
  const relatedProjects = allProjects
    .filter(p => p.id !== project.id && p.isPublished)
    .slice(0, 2);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Case study link copied to clipboard!', 'Link Copied');
    }
  };

  const handleBookmarkToggle = () => {
    if (!isLoggedIn) {
      info('Please login with OTP to save this project.', 'Login Required');
      openAuthModal();
      return;
    }
    const state = DatabaseStore.toggleBookmark(currentUser!.id, project.id);
    if (state) {
      success(`Saved "${project.name}" to your Bookmarks.`, 'Project Saved');
    } else {
      info(`Removed "${project.name}" from your Bookmarks.`);
    }
  };

  return (
    <div id={`case-study-${project.slug}`} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmarkToggle}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors"
            title="Save Project"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Share Case Study"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {project.category}
          </span>
          {project.isFeatured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured Platform
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display leading-tight">
          {project.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          {project.description || project.shortDescription}
        </p>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>Visit Live Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-slate-800 transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-semibold text-xs sm:text-sm transition-colors"
          >
            Request Similar Project
          </button>
        </div>
      </div>

      {/* Main Showcase Image & Gallery */}
      <div className="space-y-4">
        <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
          <img
            src={activeImage}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>

        {project.images && project.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {project.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeImage === img ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${project.name} ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Metadata Grid Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px] uppercase font-semibold">Client / Organization</span>
          <span className="text-white font-bold text-sm mt-1 block">{project.clientName}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px] uppercase font-semibold">Developer Role</span>
          <span className="text-indigo-400 font-bold text-sm mt-1 block">{project.role}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px] uppercase font-semibold">Project Duration</span>
          <span className="text-white font-bold text-sm mt-1 block">{project.projectDuration}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px] uppercase font-semibold">Year Completed</span>
          <span className="text-emerald-400 font-bold text-sm mt-1 block">{project.completionDate}</span>
        </div>
      </div>

      {/* Technologies Used */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Technologies & Architecture</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono font-medium shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Case Study Details: Problem, Solution, Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* The Challenge / Problem */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">The Challenge</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.challenges || 'Building an ultra-responsive, highly secure web platform meeting stringent performance thresholds.'}
          </p>
        </div>

        {/* The Engineering Solution */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Engineering Solution</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.solution || 'Engineered modular components, indexed database queries, and optimized server routing for maximum reliability.'}
          </p>
        </div>

        {/* Measurable Results */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Key Results & Impact</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.results || 'Delivered lightning-fast load times, seamless user conversions, and stable production deployment.'}
          </p>
        </div>
      </div>

      {/* Key Features Breakdown */}
      {project.features && project.features.length > 0 && (
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Key Platform Features</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action for Similar Project */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Have a similar project? Let's build it.
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          I will design, develop, and deploy your web application with identical engineering rigor and attention to detail.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Start a Project / Request Quote
          </button>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Open {project.name} Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white font-display">Related Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map(rel => (
              <ProjectCard
                key={rel.id}
                project={rel}
                onViewCaseStudy={slug => onNavigate('project-detail', slug)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
