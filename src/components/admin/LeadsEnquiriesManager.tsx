import React, { useState } from 'react';
import {
  Users,
  Inbox,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  FileSpreadsheet,
  Building2,
  Filter,
  Search,
  ExternalLink,
  Sparkles,
  X,
  Save,
  Tag
} from 'lucide-react';
import { Lead, Enquiry, LeadStatus, LeadSource, EnquiryStatus } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface LeadsEnquiriesManagerProps {
  leads: Lead[];
  enquiries: Enquiry[];
  onRefresh: () => void;
  defaultSubTab?: 'leads' | 'enquiries';
  onNavigateToQuotes?: (prefilled?: any) => void;
}

export const LeadsEnquiriesManager: React.FC<LeadsEnquiriesManagerProps> = ({
  leads,
  enquiries,
  onRefresh,
  defaultSubTab = 'leads',
  onNavigateToQuotes
}) => {
  const { success, error, info } = useToast();
  const [subTab, setSubTab] = useState<'leads' | 'enquiries'>(defaultSubTab);

  // Leads state
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);

  // Enquiries state
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [newNote, setNewNote] = useState('');

  const leadStages: LeadStatus[] = [
    'New',
    'Requirement Discussion',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost'
  ];

  const leadSources: LeadSource[] = ['Website Form', 'WhatsApp', 'Email', 'Referral', 'LinkedIn', 'Direct'];

  // Lead CRUD
  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !editingLead.name) {
      error('Lead name is required.');
      return;
    }
    DatabaseStore.saveLead(editingLead as any);
    success(`Lead "${editingLead.name}" updated in CRM.`, 'CRM Updated');
    setEditingLead(null);
    onRefresh();
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (window.confirm(`Delete lead "${name}"?`)) {
      DatabaseStore.deleteLead(id);
      success(`Lead "${name}" deleted.`);
      onRefresh();
    }
  };

  const handleConvertLeadToEnquiry = (lead: Lead) => {
    const enq = DatabaseStore.convertLeadToEnquiry(lead.id);
    if (enq) {
      success(`Converted "${lead.name}" to formal Project Enquiry!`, 'Lead Converted');
      onRefresh();
      setSubTab('enquiries');
    }
  };

  const handleConvertLeadToClient = (lead: Lead) => {
    DatabaseStore.saveClient({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || 'Private Client',
      status: 'Active',
      projectsCount: 1,
      totalBilled: lead.estimatedBudget ? parseInt(lead.estimatedBudget.replace(/\D/g, '')) || 500 : 500,
      totalPaid: 0,
      notes: `Converted from CRM Lead (${lead.requirement || 'Web Project'})`,
    });
    // Mark lead as won
    DatabaseStore.saveLead({ ...lead, status: 'Won' });
    success(`Created active client record for "${lead.name}"!`, 'Client Added');
    onRefresh();
  };

  // Enquiry Actions
  const handleUpdateEnquiryStatus = (enquiryId: string, status: EnquiryStatus) => {
    DatabaseStore.updateEnquiryStatus(enquiryId, status);
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry({ ...selectedEnquiry, status });
    }
    success(`Enquiry status changed to "${status}".`);
    onRefresh();
  };

  const handleAddEnquiryNote = (enquiryId: string) => {
    if (!newNote.trim()) return;
    DatabaseStore.addEnquiryNote(enquiryId, newNote.trim());
    setNewNote('');
    success('Internal follow-up note attached.');
    onRefresh();
    const updated = DatabaseStore.getEnquiries().find(e => e.id === enquiryId);
    if (updated) setSelectedEnquiry(updated);
  };

  const filteredLeads = leads.filter(l => leadStatusFilter === 'All' || l.status === leadStatusFilter);

  return (
    <div id="leads-enquiries-manager" className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'leads'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads CRM Pipeline ({leads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'enquiries'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Project Enquiries Inbox ({enquiries.length})</span>
          </button>
        </div>

        {subTab === 'leads' && (
          <button
            type="button"
            onClick={() =>
              setEditingLead({
                name: '',
                email: '',
                phone: '',
                company: '',
                status: 'New',
                source: 'Website Form',
                estimatedBudget: '$500 - $1,500',
                requirement: 'Custom Full Stack Web Application',
                notes: '',
                followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Lead</span>
          </button>
        )}
      </div>

      {/* Leads View */}
      {subTab === 'leads' && (
        <div className="space-y-4">
          {/* Stage Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setLeadStatusFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                leadStatusFilter === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Stages ({leads.length})
            </button>
            {leadStages.map(stage => {
              const count = leads.filter(l => l.status === stage).length;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setLeadStatusFilter(stage)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    leadStatusFilter === stage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{stage}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                      {lead.company && <p className="text-[11px] text-slate-400">{lead.company}</p>}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lead.status === 'Won'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : lead.status === 'Lost'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-3">
                    {lead.requirement || 'Web Application Development'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Budget:</span>
                      <span className="font-semibold text-emerald-400">{lead.estimatedBudget || 'TBD'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Source:</span>
                      <span className="text-slate-300">{lead.source || 'Website'}</span>
                    </div>
                    {lead.followUpDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Follow-up:</span>
                        <span className="text-indigo-300 font-mono">{lead.followUpDate}</span>
                      </div>
                    )}
                  </div>

                  {lead.notes && (
                    <p className="text-[11px] text-slate-400 italic mb-3">
                      Note: {lead.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20this%20is%20SK%20Yadav.%20Following%20up%20on%20your%20project.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-400 hover:bg-emerald-950/50 rounded transition-colors"
                          title="Open WhatsApp Chat"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}?subject=Project%20Discussion%20-%20SK%20Yadav`}
                          className="p-1.5 text-indigo-400 hover:bg-indigo-950/50 rounded transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingLead(lead)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.id, lead.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Conversion Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleConvertLeadToEnquiry(lead)}
                      className="py-1 px-2 text-[10px] font-medium bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-indigo-900/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Inbox className="w-3 h-3" />
                      <span>To Enquiry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvertLeadToClient(lead)}
                      className="py-1 px-2 text-[10px] font-medium bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-900/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Building2 className="w-3 h-3" />
                      <span>Convert Won</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No leads in this stage</p>
            </div>
          )}
        </div>
      )}

      {/* Enquiries View */}
      {subTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold">Client / Contact</th>
                    <th className="p-4 font-semibold">Project Title & Category</th>
                    <th className="p-4 font-semibold">Budget & Timeline</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {enquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{enq.clientName || enq.name}</p>
                        <p className="text-slate-400 text-[11px]">{enq.clientEmail || enq.email}</p>
                        {enq.clientPhone && (
                          <p className="text-slate-500 text-[11px]">{enq.clientPhone}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-indigo-300">{enq.projectTitle || enq.projectType}</p>
                        <p className="text-slate-400 text-[11px] line-clamp-1">{enq.description}</p>
                      </td>
                      <td className="p-4 font-mono">
                        <p className="text-emerald-400 font-semibold">{enq.budget || enq.budgetRange}</p>
                        <p className="text-slate-400 text-[11px]">{enq.timeline || 'Flexible'}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={enq.status}
                          onChange={e => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                          className="bg-slate-950 border border-slate-800 text-[11px] text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Quoted">Quoted</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(enq)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                          >
                            Details
                          </button>
                          {onNavigateToQuotes && (
                            <button
                              type="button"
                              onClick={() => {
                                onNavigateToQuotes({
                                  clientName: enq.clientName || enq.name,
                                  clientEmail: enq.clientEmail || enq.email,
                                  clientPhone: enq.clientPhone || enq.phone,
                                  projectTitle: enq.projectTitle || enq.projectType,
                                  enquiryId: enq.id,
                                });
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                              title="Create Quotation"
                            >
                              Quote
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No project enquiries received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingLead.id ? 'Edit CRM Lead' : 'Record New Lead'}
              </h3>
              <button type="button" onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lead / Contact Name *</label>
                  <input
                    type="text"
                    value={editingLead.name || ''}
                    onChange={e => setEditingLead({ ...editingLead, name: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={editingLead.company || ''}
                    onChange={e => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email ID</label>
                  <input
                    type="email"
                    value={editingLead.email || ''}
                    onChange={e => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingLead.phone || ''}
                    onChange={e => setEditingLead({ ...editingLead, phone: e.target.value })}
                    placeholder="+91 9354152837"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pipeline Stage</label>
                  <select
                    value={editingLead.status || 'New'}
                    onChange={e => setEditingLead({ ...editingLead, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    {leadStages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Source</label>
                  <select
                    value={editingLead.source || 'Website Form'}
                    onChange={e => setEditingLead({ ...editingLead, source: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    {leadSources.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    value={editingLead.estimatedBudget || ''}
                    onChange={e => setEditingLead({ ...editingLead, estimatedBudget: e.target.value })}
                    placeholder="e.g. $800 - $1,500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={editingLead.followUpDate || ''}
                    onChange={e => setEditingLead({ ...editingLead, followUpDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requirements / Scope</label>
                <textarea
                  value={editingLead.requirement || ''}
                  onChange={e => setEditingLead({ ...editingLead, requirement: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Enquiry: {selectedEnquiry.projectTitle || selectedEnquiry.projectType}
                </h3>
                <p className="text-xs text-slate-400">
                  Received {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <p className="text-[10px] text-slate-500">Client Name</p>
                <p className="text-xs font-bold text-white">{selectedEnquiry.clientName || selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Email Address</p>
                <p className="text-xs text-indigo-400 font-mono">{selectedEnquiry.clientEmail || selectedEnquiry.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Budget Range</p>
                <p className="text-xs font-bold text-emerald-400">{selectedEnquiry.budget || selectedEnquiry.budgetRange}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Timeline</p>
                <p className="text-xs text-slate-300">{selectedEnquiry.timeline || 'Flexible'}</p>
              </div>
            </div>

            {/* Scope Details */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-1">Project Requirements Description:</h4>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.description}
              </div>
            </div>

            {/* Internal Follow-up Notes */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-1.5">Internal Discussion Notes:</h4>
              <div className="space-y-2 mb-3">
                {(selectedEnquiry.notes || []).map((note, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddEnquiryNote(selectedEnquiry.id); }}
                  placeholder="Add a new follow-up note..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddEnquiryNote(selectedEnquiry.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {selectedEnquiry.clientPhone && (
                  <a
                    href={`https://wa.me/${selectedEnquiry.clientPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedEnquiry.clientName || '')},%20this%20is%20SK%20Yadav%20regarding%20your%20project%20enquiry.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
