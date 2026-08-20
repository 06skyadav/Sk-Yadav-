import React from 'react';
import {
  Globe,
  Layers,
  Briefcase,
  ShoppingCart,
  Code,
  Database,
  Cpu,
  Monitor,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onRequestQuote }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6 text-indigo-400" />;
      case 'Layers': return <Layers className="w-6 h-6 text-purple-400" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-blue-400" />;
      case 'ShoppingCart': return <ShoppingCart className="w-6 h-6 text-emerald-400" />;
      case 'Code': return <Code className="w-6 h-6 text-amber-400" />;
      case 'Database': return <Database className="w-6 h-6 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-rose-400" />;
      case 'Monitor': return <Monitor className="w-6 h-6 text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-amber-400" />;
      default: return <Code className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div
      id={`service-card-${service.slug}`}
      className="relative flex flex-col justify-between p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/30 transition-all duration-300 group hover:-translate-y-1"
    >
      {service.isPopular && (
        <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Popular Choice
        </div>
      )}

      <div>
        {/* Icon & Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-13 h-13 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 group-hover:border-indigo-500/40 transition-all shadow-inner">
            {getIcon(service.icon)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display group-hover:text-indigo-300 transition-colors">
              {service.title}
            </h3>
            {service.startingPrice && (
              <span className="text-xs font-semibold text-emerald-400">
                Starting from {service.startingPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          {service.description || service.shortDescription}
        </p>

        {/* Features Checklist */}
        <div className="space-y-2 mb-6">
          {service.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* Tech Stack List */}
        <div className="flex flex-wrap gap-1.5 pb-5 pt-3 border-t border-slate-800/60">
          {service.technologies.map((t, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] text-slate-400 font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bottom Turnaround & CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          {service.deliveryDays ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{service.deliveryDays}</span>
            </div>
          ) : <div />}

          <button
            onClick={() => onRequestQuote(service.title)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Request Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
