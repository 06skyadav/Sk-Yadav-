import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, Share2, User, Sparkles, BookOpen } from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { useToast } from '../context/ToastContext';
import { BlogPost } from '../types';

interface BlogPostDetailPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({ slug, onBack, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const { success } = useToast();

  useEffect(() => {
    const p = DatabaseStore.getBlogPostBySlug(slug);
    if (p) setPost(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-display">Article Not Found</h2>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Article link copied to clipboard!');
    }
  };

  return (
    <div id={`blog-post-${post.slug}`} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Back Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Share Article"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed font-sans">
          {post.excerpt}
        </p>

        {/* Author badge */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            SK
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{post.author}</h4>
            <p className="text-[11px] text-slate-400">Full Stack Web Developer & Software Engineer</p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content Body (Markdown formatting rendered cleanly) */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-800">
        <div className="whitespace-pre-wrap font-sans leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-4">
        <Tag className="w-4 h-4 text-slate-500" />
        {post.tags.map((t, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white font-display">
          Need expert development assistance for your web stack?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          I help companies implement modern full stack systems with high reliability and performance.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Start a Project With SK Yadav
        </button>
      </div>
    </div>
  );
};
