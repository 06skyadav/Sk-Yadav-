import React from 'react';
import {
  Code2,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Terminal,
  Layers,
  Heart,
  Globe,
  Database
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (tab: string, param?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const timeline = [
    {
      year: '2024 - Present',
      title: 'Full Stack Freelance Web Developer',
      company: 'Independent Client Platform',
      description: 'Architecting end-to-end web applications, e-commerce systems, and client platforms with React, Node.js, Express, MongoDB, and PHP/MySQL for global startups and businesses.'
    },
    {
      year: '2023 - 2024',
      title: 'Lead Web Developer & System Integrator',
      company: 'SecOpsHub & Institutional Portals',
      description: 'Engineered high-security platforms including VicharManch and Disha Computer Institute portal, delivering database modeling, role-based auth, and responsive UI interfaces.'
    },
    {
      year: '2022 - 2023',
      title: 'Frontend & UI/UX Developer',
      company: 'Digital Solutions Studio',
      description: 'Designed modern responsive websites, custom WordPress/WooCommerce shops, and optimized web performance across 25+ business client deployments.'
    },
  ];

  const corePrinciples = [
    {
      title: 'Security-First Architecture',
      desc: 'Sanitized database queries, prepared statements, encrypted JWT tokens, and strict input validation on every endpoint.'
    },
    {
      title: 'Sub-Second Core Web Vitals',
      desc: 'Optimized asset delivery, lightweight DOM nodes, lazy loading, and sub-100ms response times.'
    },
    {
      title: 'Clean, Maintainable Code',
      desc: 'Modular TypeScript and clean PHP structures that your internal team or future developers can easily extend.'
    },
    {
      title: 'Direct Client Collaboration',
      desc: 'No middle managers or agency markups. You communicate directly with the engineer building your product.'
    }
  ];

  return (
    <div id="about-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Intro Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>About The Developer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display leading-tight">
            Crafting Scalable, High-Impact Web Solutions For Modern Businesses.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {settings.fullBio || settings.shortBio}
          </p>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Whether you are launching an innovative new product, overhauling an existing corporate web presence, or requiring custom database workflows, my commitment is delivering dependable, beautifully crafted software on time and within budget.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Start a Project With SK Yadav
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-800 transition-all cursor-pointer"
            >
              Explore Case Studies
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl font-display shadow-lg shadow-indigo-600/30">
                SK
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">{settings.profileName}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{settings.professionalTitle}</p>
                <p className="text-[11px] text-emerald-400 mt-0.5">● {settings.availabilityStatus} for Hire</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Experience</span>
                <span className="text-base font-bold text-white mt-1 block">{settings.experienceYears}+ Years</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Completed Projects</span>
                <span className="text-base font-bold text-indigo-400 mt-1 block">{settings.completedProjectsCount}+ Done</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Primary Stacks</span>
                <span className="text-xs font-bold text-white mt-1 block">MERN / PHP / MySQL</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Hourly Rate</span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block">{settings.hourlyRate}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Philosophy / Principles */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>Development Standards</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display">
            How I Guarantee Production Quality
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {corePrinciples.map((prin, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                0{i + 1}
              </div>
              <h3 className="text-base font-bold text-white font-display">{prin.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{prin.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience & Career Timeline */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Milestones & Experience</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display">
            Professional Career Timeline
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="relative pl-8 sm:pl-10 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-800 last:before:hidden"
            >
              <div className="absolute left-1.5 top-2 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-slate-950" />
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white font-display">{item.title}</h3>
                  <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {item.year}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-medium">{item.company}</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
