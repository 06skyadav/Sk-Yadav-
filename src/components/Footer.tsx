import React from 'react';
import {
  Code2,
  Mail,
  Phone,
  MessageSquare,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  ArrowUpRight,
  Heart,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  setCurrentTab: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentTab }) => {
  return (
    <footer id="main-footer" className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      {/* Top Banner CTA */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for New Projects</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Have an idea for a website or custom web app?
            </h3>
            <p className="text-slate-400 mt-1 max-w-xl">
              Let's turn your concept into a fast, secure, and revenue-generating digital product.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Start a Project
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello SK Yadav, I saw your portfolio and would like to discuss a website project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Me</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-14 sm:w-16 rounded-xl bg-slate-900/90 dark:bg-slate-900/60 border border-slate-800/80 p-1.5 shadow-md shrink-0">
              <img
                src="/logo.png"
                alt="SK Yadav Official Logo"
                className="h-full w-full object-contain dark:invert dark:brightness-200"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white font-display">
                {settings.profileName}
              </span>
              <p className="text-xs text-indigo-400 font-medium">Full Stack Web Developer</p>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            {settings.shortBio}
          </p>

          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{settings.availabilityStatus} ({settings.availabilityMessage})</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-2">
            {settings.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 font-display">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors cursor-pointer">
                About SK Yadav
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('projects')} className="hover:text-white transition-colors cursor-pointer">
                Project Portfolio
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                Services & Pricing
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('blog')} className="hover:text-white transition-colors cursor-pointer">
                Tech Blog
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('contact')} className="hover:text-white transition-colors cursor-pointer">
                Contact & Hire
              </button>
            </li>
          </ul>
        </div>

        {/* Featured Stacks */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 font-display">Core Services</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                MERN Stack Development
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                PHP & MySQL Systems
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                E-commerce Platforms
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                WordPress & WooCommerce
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                Custom Web Applications
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors cursor-pointer">
                Bug Fixing & Speed Tuning
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 font-display">Direct Contact</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">
                {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp Direct (+{settings.whatsappNumber})
              </a>
            </li>
            <li className="pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                ⚡ Typical response time: <span className="font-semibold text-emerald-400">Within 2 Hours</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.profileName}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              Built with precision <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> & modern code
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
