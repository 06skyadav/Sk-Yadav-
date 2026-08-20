import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, ArrowRight, Clock, HelpCircle, MessageSquare } from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { ServiceCard } from '../components/ServiceCard';
import { SiteSettings } from '../types';

interface ServicesPageProps {
  settings: SiteSettings;
  onNavigate: (tab: string, param?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ settings, onNavigate }) => {
  const services = DatabaseStore.getServices();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? services
    : services.filter(s => s.title.toLowerCase().includes(filter.toLowerCase()) || s.technologies.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <div id="services-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Services & Solutions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Full Stack & Web Engineering Services
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Transparent, high-standard freelance web development tailored to your exact business specifications. Every project includes clean code, SEO readiness, and post-launch support.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {['All', 'MERN', 'PHP', 'WordPress', 'E-commerce', 'Maintenance'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onRequestQuote={serviceTitle => onNavigate('dashboard', serviceTitle)}
          />
        ))}
      </div>

      {/* Custom Enterprise Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Need a Custom SaaS Platform or Unique Integration?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            We handle complex custom web architectures, third-party API webhooks, automated PDF invoicing, and bespoke database workflows.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 shrink-0 transition-all cursor-pointer"
        >
          Request Custom Proposal
        </button>
      </div>
    </div>
  );
};
