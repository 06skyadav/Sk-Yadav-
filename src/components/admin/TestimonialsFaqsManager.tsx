import React, { useState } from 'react';
import {
  MessageSquareQuote,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  Save,
  Search
} from 'lucide-react';
import { Testimonial, FAQItem } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface TestimonialsFaqsManagerProps {
  testimonials: Testimonial[];
  faqs: FAQItem[];
  onRefresh: () => void;
  defaultSubTab?: 'testimonials' | 'faqs';
}

export const TestimonialsFaqsManager: React.FC<TestimonialsFaqsManagerProps> = ({
  testimonials,
  faqs,
  onRefresh,
  defaultSubTab = 'testimonials'
}) => {
  const { success, error, info } = useToast();
  const [subTab, setSubTab] = useState<'testimonials' | 'faqs'>(defaultSubTab);

  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  // Testimonial Actions
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.clientName) {
      error('Client name is required.');
      return;
    }
    DatabaseStore.saveTestimonial(editingTestimonial as any);
    success(`Testimonial from "${editingTestimonial.clientName}" saved.`);
    setEditingTestimonial(null);
    onRefresh();
  };

  const handleDeleteTestimonial = (id: string, name: string) => {
    if (window.confirm(`Delete testimonial from "${name}"?`)) {
      DatabaseStore.deleteTestimonial(id);
      success(`Testimonial removed.`);
      onRefresh();
    }
  };

  // FAQ Actions
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question) {
      error('FAQ question is required.');
      return;
    }
    DatabaseStore.saveFAQ(editingFaq as any);
    success(`FAQ saved.`);
    setEditingFaq(null);
    onRefresh();
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Delete this FAQ question?')) {
      DatabaseStore.deleteFAQ(id);
      success(`FAQ deleted.`);
      onRefresh();
    }
  };

  return (
    <div id="testimonials-faqs-manager" className="space-y-6">
      {/* Sub tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('testimonials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'testimonials'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Testimonials & Reviews ({testimonials.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('faqs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'faqs'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Database ({faqs.length})</span>
          </button>
        </div>

        {subTab === 'testimonials' ? (
          <button
            type="button"
            onClick={() =>
              setEditingTestimonial({
                clientName: '',
                clientRole: '',
                company: '',
                rating: 5,
                content: '',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                projectTitle: '',
                isFeatured: true,
                isPublished: true,
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setEditingFaq({
                question: '',
                answer: '',
                category: 'General',
                order: faqs.length + 1,
                isPublished: true,
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        )}
      </div>

      {/* Testimonials List */}
      {subTab === 'testimonials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={t.clientName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.clientName}</h4>
                      <p className="text-[11px] text-slate-400">{t.clientRole || t.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic mb-3 line-clamp-3 leading-relaxed">
                  "{t.content}"
                </p>

                {t.projectTitle && (
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded">
                    Project: {t.projectTitle}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(t)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(t.id, t.clientName)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQs List */}
      {subTab === 'faqs' && (
        <div className="space-y-3">
          {faqs.map(faq => (
            <div
              key={faq.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono">
                    {faq.category || 'General'}
                  </span>
                  <h4 className="text-xs font-bold text-white">{faq.question}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-1">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingFaq(faq)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button type="button" onClick={() => setEditingTestimonial(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={editingTestimonial.clientName || ''}
                    onChange={e => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Company</label>
                  <input
                    type="text"
                    value={editingTestimonial.clientRole || ''}
                    onChange={e => setEditingTestimonial({ ...editingTestimonial, clientRole: e.target.value })}
                    placeholder="e.g. Founder, VicharManch"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client Review / Quote *</label>
                <textarea
                  value={editingTestimonial.content || ''}
                  onChange={e => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  required
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={editingTestimonial.avatarUrl || ''}
                    onChange={e => setEditingTestimonial({ ...editingTestimonial, avatarUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1 to 5)</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={e => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingFaq.id ? 'Edit FAQ' : 'Add FAQ Question'}
              </h3>
              <button type="button" onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={editingFaq.category || 'General'}
                  onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  <option value="General">General</option>
                  <option value="Pricing & Payment">Pricing & Payment</option>
                  <option value="Timeline & Process">Timeline & Process</option>
                  <option value="Tech & Hosting">Tech & Hosting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question *</label>
                <input
                  type="text"
                  value={editingFaq.question || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  required
                  placeholder="e.g. Do you offer post-launch maintenance?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Answer *</label>
                <textarea
                  value={editingFaq.answer || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  required
                  rows={4}
                  placeholder="Detailed answer provided to prospective clients..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
