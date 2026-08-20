import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Calendar,
  X,
  Save,
  Printer
} from 'lucide-react';
import { Quote, ClientRecord, QuotationItem, SiteSettings } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';
import { generateQuotationPDF } from '../../utils/pdfGenerator';

interface QuotesClientsManagerProps {
  quotes: Quote[];
  clients: ClientRecord[];
  settings: SiteSettings;
  onRefresh: () => void;
  defaultSubTab?: 'quotes' | 'clients';
  prefilledQuote?: Partial<Quote> | null;
}

export const QuotesClientsManager: React.FC<QuotesClientsManagerProps> = ({
  quotes,
  clients,
  settings,
  onRefresh,
  defaultSubTab = 'quotes',
  prefilledQuote
}) => {
  const { success, error, info } = useToast();
  const [subTab, setSubTab] = useState<'quotes' | 'clients'>(defaultSubTab);

  // Quote editing state
  const [editingQuote, setEditingQuote] = useState<Partial<Quote> | null>(prefilledQuote || null);

  // Client editing state
  const [editingClient, setEditingClient] = useState<Partial<ClientRecord> | null>(null);

  // Quote item line helper
  const addLineItem = () => {
    if (!editingQuote) return;
    const current = editingQuote.items || [];
    const newItem: QuotationItem = {
      description: 'Custom Feature / Module Implementation',
      quantity: 1,
      rate: 200,
      amount: 200,
    };
    const updatedItems = [...current, newItem];
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = Math.round(subtotal * ((editingQuote.taxRate || 0) / 100));
    const total = subtotal + tax - (editingQuote.discount || 0);

    setEditingQuote({
      ...editingQuote,
      items: updatedItems,
      subtotal,
      tax,
      total,
    });
  };

  const updateLineItem = (index: number, field: keyof QuotationItem, value: any) => {
    if (!editingQuote || !editingQuote.items) return;
    const updated = [...editingQuote.items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      item.amount = (Number(item.quantity) || 1) * (Number(item.rate) || 0);
    }
    updated[index] = item;

    const subtotal = updated.reduce((sum, i) => sum + i.amount, 0);
    const tax = Math.round(subtotal * ((editingQuote.taxRate || 0) / 100));
    const total = subtotal + tax - (editingQuote.discount || 0);

    setEditingQuote({
      ...editingQuote,
      items: updated,
      subtotal,
      tax,
      total,
    });
  };

  const removeLineItem = (index: number) => {
    if (!editingQuote || !editingQuote.items) return;
    const updated = [...editingQuote.items];
    updated.splice(index, 1);
    const subtotal = updated.reduce((sum, i) => sum + i.amount, 0);
    const tax = Math.round(subtotal * ((editingQuote.taxRate || 0) / 100));
    const total = subtotal + tax - (editingQuote.discount || 0);

    setEditingQuote({
      ...editingQuote,
      items: updated,
      subtotal,
      tax,
      total,
    });
  };

  // Save Quote
  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote || !editingQuote.clientName || !editingQuote.projectTitle) {
      error('Client name and project title are required.');
      return;
    }

    DatabaseStore.saveQuotation(editingQuote as any);
    success(`Quotation for "${editingQuote.clientName}" saved!`, 'Quotation Stored');
    setEditingQuote(null);
    onRefresh();
  };

  const handleDeleteQuote = (id: string) => {
    if (window.confirm('Delete this quotation permanently?')) {
      DatabaseStore.deleteQuotation(id);
      success('Quotation removed.');
      onRefresh();
    }
  };

  const handleDuplicateQuote = (quote: Quote) => {
    const copy: Partial<Quote> = {
      ...quote,
      id: undefined,
      quotationNumber: `QT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'Draft',
    };
    DatabaseStore.saveQuotation(copy as any);
    success('Quotation duplicated as new Draft.');
    onRefresh();
  };

  const handleDownloadPDF = (quote: Quote) => {
    try {
      generateQuotationPDF(quote, settings);
      success(`Generating and downloading PDF for ${quote.quotationNumber}...`, 'PDF Downloaded');
    } catch (err: any) {
      error('Failed to generate quotation PDF: ' + err.message);
    }
  };

  // Client CRUD
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.name) {
      error('Client name is required.');
      return;
    }
    DatabaseStore.saveClient(editingClient as any);
    success(`Client record "${editingClient.name}" updated!`);
    setEditingClient(null);
    onRefresh();
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`Delete client record "${name}"?`)) {
      DatabaseStore.deleteClient(id);
      success(`Client record deleted.`);
      onRefresh();
    }
  };

  return (
    <div id="quotes-clients-manager" className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'quotes'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Quotations & Invoices ({quotes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('clients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === 'clients'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Client Directory ({clients.length})</span>
          </button>
        </div>

        {subTab === 'quotes' ? (
          <button
            type="button"
            onClick={() =>
              setEditingQuote({
                quotationNumber: `QT-${Date.now().toString().slice(-4)}`,
                clientName: '',
                clientEmail: '',
                clientPhone: '',
                clientCompany: '',
                projectTitle: 'Custom Web Development Project',
                currency: 'USD',
                items: [
                  { description: 'Frontend Architecture & Responsive UI', quantity: 1, rate: 450, amount: 450 },
                  { description: 'Backend API & Database Integration', quantity: 1, rate: 400, amount: 400 },
                  { description: 'Testing, Deployment & Free 30-Day Support', quantity: 1, rate: 150, amount: 150 },
                ],
                subtotal: 1000,
                taxRate: 0,
                tax: 0,
                discount: 0,
                total: 1000,
                notes: '50% advance to start milestone development. Balance due on final deployment approval.',
                terms: 'Delivery timeframe: 3 weeks. Source code and deployment credentials handed over on completion.',
                validUntil: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
                status: 'Draft',
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Quotation</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setEditingClient({
                name: '',
                email: '',
                phone: '',
                company: '',
                status: 'Active',
                projectsCount: 1,
                totalBilled: 1000,
                totalPaid: 500,
                notes: '',
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Record</span>
          </button>
        )}
      </div>

      {/* Quotes List View */}
      {subTab === 'quotes' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold">Quote # / Date</th>
                    <th className="p-4 font-semibold">Client & Company</th>
                    <th className="p-4 font-semibold">Project Title</th>
                    <th className="p-4 font-semibold">Total Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {quotes.map(q => (
                    <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono">
                        <p className="font-bold text-white">{q.quotationNumber || q.id}</p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{q.clientName}</p>
                        <p className="text-slate-400 text-[11px]">{q.clientCompany || q.clientEmail}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-indigo-300">{q.projectTitle}</p>
                        <p className="text-slate-500 text-[11px]">Valid until: {q.validUntil}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        {q.currency === 'INR' ? '₹' : '$'}{q.total.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={q.status}
                          onChange={e => {
                            DatabaseStore.saveQuotation({ ...q, status: e.target.value as any });
                            onRefresh();
                          }}
                          className="bg-slate-950 border border-slate-800 text-[11px] text-white rounded-lg px-2 py-1"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Declined">Declined</option>
                          <option value="Paid">Paid / Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleDownloadPDF(q)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateQuote(q)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                            title="Duplicate Quote"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingQuote(q)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                            title="Edit Quotation"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuote(q.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                            title="Delete Quotation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No quotations generated yet. Click "Generate New Quotation" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Clients Directory */}
      {subTab === 'clients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(cli => (
            <div
              key={cli.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{cli.name}</h4>
                    <p className="text-[11px] text-slate-400">{cli.company || 'Private Client'}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {cli.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Email:</span>
                    <span className="text-indigo-300 truncate max-w-[160px]">{cli.email}</span>
                  </div>
                  {cli.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Phone:</span>
                      <span className="text-slate-300 font-mono">{cli.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Total Billed:</span>
                    <span className="text-emerald-400 font-semibold font-mono">${(cli.totalBilled || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Projects:</span>
                    <span className="text-white font-semibold">{cli.projectsCount || 1}</span>
                  </div>
                </div>

                {cli.notes && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-2">
                    {cli.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(cli)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClient(cli.id, cli.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              No clients recorded yet.
            </div>
          )}
        </div>
      )}

      {/* Edit Quotation Modal */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingQuote.id ? `Edit Quote: ${editingQuote.quotationNumber}` : 'Create Itemized Quotation'}
                </h3>
                <p className="text-xs text-slate-400">Generate a custom proposal with PDF export</p>
              </div>
              <button type="button" onClick={() => setEditingQuote(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-4">
              {/* Row 1: Quote #, Currency, Valid Until */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Quote Reference #</label>
                  <input
                    type="text"
                    value={editingQuote.quotationNumber || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, quotationNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
                  <select
                    value={editingQuote.currency || 'USD'}
                    onChange={e => setEditingQuote({ ...editingQuote, currency: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={editingQuote.validUntil || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, validUntil: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Row 2: Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={editingQuote.clientName || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, clientName: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={editingQuote.clientEmail || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, clientEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Client Company</label>
                  <input
                    type="text"
                    value={editingQuote.clientCompany || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, clientCompany: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Scope Title *</label>
                <input
                  type="text"
                  value={editingQuote.projectTitle || ''}
                  onChange={e => setEditingQuote({ ...editingQuote, projectTitle: e.target.value })}
                  required
                  placeholder="e.g. Full Stack Custom Web Portal & API Integration"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Itemized Line Items</label>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item Line
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingQuote.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => updateLineItem(idx, 'description', e.target.value)}
                        placeholder="Item description..."
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateLineItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white text-center font-mono"
                      />
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={e => updateLineItem(idx, 'rate', parseInt(e.target.value) || 0)}
                        className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white text-right font-mono"
                      />
                      <span className="w-20 text-right text-xs font-mono font-bold text-emerald-400">
                        ${item.amount}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">${editingQuote.subtotal || 0}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Tax Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingQuote.taxRate || 0}
                    onChange={e => {
                      const taxRate = parseInt(e.target.value) || 0;
                      const subtotal = editingQuote.subtotal || 0;
                      const tax = Math.round(subtotal * (taxRate / 100));
                      const total = subtotal + tax - (editingQuote.discount || 0);
                      setEditingQuote({ ...editingQuote, taxRate, tax, total });
                    }}
                    className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-right text-xs text-white font-mono"
                  />
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Discount ($):</span>
                  <input
                    type="number"
                    min="0"
                    value={editingQuote.discount || 0}
                    onChange={e => {
                      const discount = parseInt(e.target.value) || 0;
                      const subtotal = editingQuote.subtotal || 0;
                      const tax = editingQuote.tax || 0;
                      const total = subtotal + tax - discount;
                      setEditingQuote({ ...editingQuote, discount, total });
                    }}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-right text-xs text-white font-mono"
                  />
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400 font-mono">${(editingQuote.total || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Payment Notes</label>
                  <textarea
                    value={editingQuote.notes || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, notes: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Terms & Delivery</label>
                  <textarea
                    value={editingQuote.terms || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, terms: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuote(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingClient.id ? 'Edit Client Record' : 'Add Client Record'}
              </h3>
              <button type="button" onClick={() => setEditingClient(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={editingClient.name || ''}
                  onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingClient.email || ''}
                    onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingClient.phone || ''}
                    onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                    placeholder="+91 9354152837"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={editingClient.company || ''}
                    onChange={e => setEditingClient({ ...editingClient, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingClient.status || 'Active'}
                    onChange={e => setEditingClient({ ...editingClient, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Notes</label>
                <textarea
                  value={editingClient.notes || ''}
                  onChange={e => setEditingClient({ ...editingClient, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
