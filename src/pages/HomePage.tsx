import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  CheckCircle2,
  Layers,
  Terminal,
  Shield,
  Zap,
  Clock,
  MessageSquare,
  Award,
  Users,
  Briefcase,
  ChevronDown,
  FolderCode,
  Globe,
  Database,
  Cpu,
  Star
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { ProjectCard } from '../components/ProjectCard';
import { ServiceCard } from '../components/ServiceCard';
import { SiteSettings, ProjectCategory } from '../types';

interface HomePageProps {
  settings: SiteSettings;
  onNavigate: (tab: string, slugOrParam?: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ settings, onNavigate, onOpenSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [activeFaq, setActiveFaq] = useState<string | null>('faq-1');

  const allProjects = DatabaseStore.getProjects();
  const allServices = DatabaseStore.getServices();
  const allSkills = DatabaseStore.getSkills();
  const allFaqs = DatabaseStore.getFAQs();
  const allTestimonials = DatabaseStore.getTestimonials();
  const websiteContent = DatabaseStore.getWebsiteContent();

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

  const filteredProjects = selectedCategory === 'All'
    ? allProjects.filter(p => p.isPublished)
    : allProjects.filter(p => p.isPublished && (p.category === selectedCategory || p.technologies.some(t => t.toLowerCase() === selectedCategory.toLowerCase())));

  const stepsList = websiteContent.workflowSteps || websiteContent.workflow || [];
  const workSteps = stepsList.map((step, idx) => ({
    num: step.num || `0${step.stepNumber || idx + 1}`.slice(-2),
    title: step.title,
    desc: step.desc || step.description || '',
    timeframe: step.timeframe || '',
  }));

  return (
    <div id="home-page" className="space-y-24 sm:space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="relative pt-12 sm:pt-20 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg shadow-slate-950/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {settings.availabilityStatus} for Freelance Projects
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-indigo-400 font-medium">{settings.hourlyRate}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6.5xl font-extrabold tracking-tight text-white font-display leading-[1.08]">
                Turning Ideas Into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
                  Powerful Digital
                </span>{' '}
                Experiences.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Hi, I'm <strong className="text-white font-bold">{settings.profileName}</strong> — Full Stack Web Developer. I build high-performance, responsive websites, e-commerce stores, and custom web applications that scale your business.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-start-project-btn"
                  onClick={() => onNavigate('dashboard')}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start a Project</span>
                </button>

                <button
                  id="hero-view-work-btn"
                  onClick={() => onNavigate('projects')}
                  className="px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>View My Work</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello SK Yadav, I saw your portfolio and would like to discuss a project.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Me</span>
                </a>
              </div>

              {/* Tech Stack Mini Pills */}
              <div className="pt-4 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                  Core Stacks:
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">React</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">Node.js</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">MongoDB</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">PHP & MySQL</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">WordPress</span>
              </div>
            </div>

            {/* Right Interactive Code / Visual Terminal */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4">
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">sk-yadav@developer-platform ~</span>
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>

                {/* Code Snippet */}
                <div className="font-mono text-xs text-slate-300 leading-relaxed space-y-2 py-2">
                  <p className="text-slate-500">// Welcome to SK Yadav's Freelance Platform</p>
                  <p>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-300">developer</span> = &#123;
                  </p>
                  <p className="pl-4">
                    <span className="text-slate-400">name:</span> <span className="text-emerald-300">'SK Yadav'</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-slate-400">specialization:</span>{' '}
                    <span className="text-emerald-300">'Full Stack & Custom Web Apps'</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-slate-400">stacks:</span> [
                    <span className="text-amber-300">'MERN'</span>,{' '}
                    <span className="text-amber-300">'PHP/MySQL'</span>,{' '}
                    <span className="text-amber-300">'E-Commerce'</span>],
                  </p>
                  <p className="pl-4">
                    <span className="text-slate-400">status:</span>{' '}
                    <span className="text-emerald-400">'Ready to Build Your Project'</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-slate-400">guarantee:</span>{' '}
                    <span className="text-indigo-300">'Clean Code • SEO Ready • Fast Delivery'</span>
                  </p>
                  <p>&#125;;</p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Fast Sub-2hr Client Response
                    </span>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                    >
                      Get Quote →
                    </button>
                  </div>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-xl font-extrabold text-white font-display">
                      {settings.completedProjectsCount}+
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Projects Done</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-xl font-extrabold text-indigo-400 font-display">
                      {settings.experienceYears}+ Yrs
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Experience</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-xl font-extrabold text-emerald-400 font-display">
                      100%
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROJECTS SHOWCASE */}
      <section id="featured-projects-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <FolderCode className="w-4 h-4" />
              <span>Real Client Work & Production Platforms</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Featured Case Studies
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Explore real-world platforms built by SK Yadav with measurable outcomes and verified technologies.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.slice(0, 4).map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewCaseStudy={slug => onNavigate('project-detail', slug)}
            />
          ))}
        </div>

        {/* View All Projects Action */}
        <div className="mt-12 text-center">
          <button
            id="view-all-projects-btn"
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Explore All Projects & Live Demos</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Comprehensive Freelance Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Services Built For Real Business Growth
          </h2>
          <p className="text-slate-400 text-sm">
            From single landing pages to enterprise multi-tenant web applications, we provide end-to-end craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.slice(0, 6).map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onRequestQuote={serviceTitle => onNavigate('dashboard', serviceTitle)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All 10+ Development Services & Pricing Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. WORKFLOW / "HOW I WORK" */}
      <section id="workflow-section" className="border-y border-slate-800/80 bg-slate-950/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Transparent & Efficient</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              How We Work Together
            </h2>
            <p className="text-slate-400 text-sm">
              A streamlined, battle-tested development lifecycle that keeps you informed at every milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workSteps.slice(0, 4).map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative group hover:border-indigo-500/40 transition-colors"
              >
                <div className="text-3xl font-extrabold text-indigo-500/40 font-mono group-hover:text-indigo-400 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-white font-display">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {workSteps.slice(4, 7).map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative group hover:border-indigo-500/40 transition-colors"
              >
                <div className="text-3xl font-extrabold text-indigo-500/40 font-mono group-hover:text-indigo-400 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-white font-display">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SKILLS MATRIX */}
      <section id="skills-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Technical Proficiencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Modern Full Stack Arsenal
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              I pick the right tool for the job. Whether you need a reactive MERN stack, a rock-solid PHP/MySQL database backend, or an editable WordPress setup, everything is built to production standards.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Security & Sanitization First</span>
                  <span className="text-slate-400">Strict input validation, XSS prevention, and encrypted JWT tokens.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Sub-Second Performance</span>
                  <span className="text-slate-400">Optimized bundle size, indexed queries, and Google Core Web Vitals.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {allSkills.slice(0, 12).map(skill => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white font-mono">{skill.name}</span>
                      <span className="text-[11px] font-semibold text-indigo-400">{skill.proficiency}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS */}
      {allTestimonials.length > 0 && (
        <section id="testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Client Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              What Clients Say About Working With SK Yadav
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allTestimonials.map(test => (
              <div
                key={test.id}
                className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    "{test.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.clientName}</h4>
                    <p className="text-[11px] text-slate-400">{test.role ? `${test.role}, ` : ''}{test.company}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-mono">
                    {test.projectTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. FAQ SECTION */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Clear Answers Before We Begin
          </h2>
        </div>

        <div className="space-y-3">
          {allFaqs.map(faq => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL BOTTOM CTA BANNER */}
      <section id="bottom-cta-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
              Let's Build Something Great Together.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Ready to discuss your project requirements or request an itemized quotation? I am available and ready to get started.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              Start a Project / Request Quote
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello SK Yadav, I want to discuss a project with you.")}`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
