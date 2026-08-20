import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { BlogPost } from '../types';

interface BlogPageProps {
  onSelectPost: (slug: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost }) => {
  const blogs = DatabaseStore.getBlogPosts();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = ['All', ...Array.from(new Set(blogs.flatMap(b => b.tags)))];

  const filteredBlogs = selectedTag === 'All'
    ? blogs.filter(b => b.isPublished)
    : blogs.filter(b => b.isPublished && b.tags.includes(selectedTag));

  return (
    <div id="blog-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Technical Insights & Engineering Guides</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Web Development Articles & Case Notes
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Practical tutorials, architecture deep-dives, database optimization strategies, and full-stack web insights by SK Yadav.
        </p>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map(blog => (
          <div
            key={blog.id}
            onClick={() => onSelectPost(blog.slug)}
            className="group flex flex-col justify-between rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/40"
          >
            <div>
              {/* Thumbnail */}
              <div className="aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-semibold">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors font-display line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {blog.tags.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-400 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Read More Footer */}
            <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Read Full Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
