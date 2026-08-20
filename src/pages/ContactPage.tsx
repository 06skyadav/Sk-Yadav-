import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  DollarSign
} from 'lucide-react';
import { DatabaseStore } from '../services/dbStore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SiteSettings, ProjectEnquiry } from '../types';

interface ContactPageProps {
  settings: SiteSettings;
  onNavigate: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const { currentUser, isLoggedIn } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [subject, setSubject] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Full Stack Web Application');
  const [budget, setBudget] = useState('$1,000 - $3,000');
  const [deadline, setDeadline] = useState('2 - 4 Weeks');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      error('Please complete all required fields (Name, Email, Message).');
      return;
    }

    setIsSubmitting(true);

    try {
      const newEnquiry: ProjectEnquiry = {
        id: `enq-${Date.now()}`,
        userId: currentUser ? currentUser.id : undefined,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        serviceCategory,
        projectTitle: subject.trim() || `${serviceCategory} Project`,
        projectDescription: message.trim(),
        budgetRange: budget,
        preferredTimeline: deadline,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: []
      };

      DatabaseStore.saveEnquiry(newEnquiry);
      setSubmittedId(newEnquiry.id);

      // Dispatch notification to backend endpoint targeting admin (skyadav02837@gmail.com)
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            subject: subject.trim() || `${serviceCategory} Project`,
            message: message.trim(),
            category: serviceCategory,
            budget,
            deadline,
            targetAdminEmail: 'skyadav02837@gmail.com'
          })
        });
      } catch (postErr) {
        console.warn('Backend notification async log:', postErr);
      }

      success('Your project inquiry has been received! SK Yadav will contact you within 2 hours.', 'Inquiry Sent');
    } catch (err) {
      error('Failed to submit inquiry. Please try again or WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch With SK Yadav</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Let's Discuss Your Next Web Project
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Have an idea, need a custom web application, or looking for an experienced freelance developer? Reach out and get a clear response within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Availability Card */}
          <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                SK
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">{settings.profileName}</h3>
                <p className="text-xs text-indigo-400">{settings.professionalTitle}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span>
                <strong>Status:</strong> {settings.availabilityStatus} ({settings.availabilityMessage})
              </span>
            </div>

            {/* Response time guarantee */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Typical Response Time: <strong className="text-white">Under 2 Hours</strong></span>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{settings.email}</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello SK Yadav, I would like to discuss a web project.")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Direct Chat</span>
                </div>
                <span className="text-[11px] bg-emerald-500/30 px-2 py-0.5 rounded-full">Online</span>
              </a>
            </div>
          </div>

          {/* Client Assurance */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs text-slate-400">
            <h4 className="font-bold text-white text-sm">What Happens Next?</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Initial discovery review of your project requirements.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Itemized timeline & quotation breakdown delivered.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-obligation technical consultation call if needed.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            {submittedId ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">Inquiry Successfully Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{name}</strong>. Your enquiry (ID: <span className="font-mono text-indigo-300">{submittedId}</span>) has been logged in the system. SK Yadav will review your requirements and respond shortly.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setMessage('');
                      setSubject('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    View in Client Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Service Category
                    </label>
                    <select
                      value={serviceCategory}
                      onChange={e => setServiceCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>Full Stack Web Application</option>
                      <option>MERN Stack Development</option>
                      <option>PHP & MySQL Web System</option>
                      <option>E-commerce Store Development</option>
                      <option>WordPress / WooCommerce Customization</option>
                      <option>Frontend UI/UX Development</option>
                      <option>API Development & Webhooks</option>
                      <option>Bug Fixing & Performance Optimization</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Estimated Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>&lt; $500 (Small Task / Bug Fix)</option>
                      <option>$500 - $1,000 (Standard Website)</option>
                      <option>$1,000 - $3,000 (Full Stack / E-commerce)</option>
                      <option>$3,000 - $5,000+ (Custom SaaS / Complex Portal)</option>
                      <option>Flexible / To Be Discussed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Timeline / Deadline
                    </label>
                    <select
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>Urgent (&lt; 1 Week)</option>
                      <option>1 - 2 Weeks</option>
                      <option>2 - 4 Weeks</option>
                      <option>1 - 2 Months</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Subject / Headline
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Redesigning Our Corporate Portal and Adding Client Dashboard"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Details & Key Requirements <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe what you want to build, any reference sites, specific features needed, or existing system details..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Project Enquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
