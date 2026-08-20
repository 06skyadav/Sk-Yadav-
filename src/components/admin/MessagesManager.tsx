import React, { useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { ContactMessage } from '../../types';
import { DatabaseStore } from '../../services/dbStore';
import { useToast } from '../../context/ToastContext';

interface MessagesManagerProps {
  messages: ContactMessage[];
  onRefresh: () => void;
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({
  messages,
  onRefresh,
}) => {
  const { success, info } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filtered = messages.filter(m => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !m.isRead) ||
      (filter === 'read' && m.isRead);
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleToggleRead = (id: string) => {
    const isNowRead = DatabaseStore.markMessageRead(id);
    info(isNowRead ? 'Marked as read' : 'Marked as unread');
    onRefresh();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete message from "${name}"?`)) {
      DatabaseStore.deleteContactMessage(id);
      success('Message deleted.');
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      onRefresh();
    }
  };

  return (
    <div id="messages-manager" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            Contact Inquiries & Messages ({messages.length})
          </h2>
          <p className="text-xs text-slate-400">
            Messages sent via public contact forms and floating chat triggers.
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unread ({messages.filter(m => !m.isRead).length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by sender name, email, subject, or message content..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map(msg => (
          <div
            key={msg.id}
            className={`p-4 rounded-2xl border transition-colors flex items-start justify-between gap-4 ${
              !msg.isRead
                ? 'bg-indigo-950/20 border-indigo-700/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{msg.name}</span>
                <span className="text-[11px] text-indigo-400 font-mono">({msg.email})</span>
                {msg.phone && (
                  <span className="text-[11px] text-slate-400 font-mono">• {msg.phone}</span>
                )}
                {!msg.isRead && (
                  <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {msg.subject && (
                <p className="text-xs font-semibold text-slate-200">{msg.subject}</p>
              )}

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {msg.message}
              </p>

              <p className="text-[10px] text-slate-500 font-mono">
                Received: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 pt-1">
              <button
                type="button"
                onClick={() => setSelectedMessage(msg)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Read
              </button>
              {msg.phone && (
                <a
                  href={`https://wa.me/${msg.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(msg.name)},%20this%20is%20SK%20Yadav%20replying%20to%20your%20inquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-emerald-400 hover:bg-emerald-950/50 rounded"
                  title="Reply on WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject || 'Your Inquiry')}`}
                className="p-1.5 text-indigo-400 hover:bg-indigo-950/50 rounded"
                title="Reply via Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => handleToggleRead(msg.id)}
                className="p-1.5 text-slate-400 hover:text-white rounded"
                title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
              >
                {msg.isRead ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(msg.id, msg.name)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                title="Delete Message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No contact messages found.
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Message from {selectedMessage.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedMessage.email}</p>
              </div>
              <button type="button" onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedMessage.subject && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Subject</span>
                <p className="text-xs font-semibold text-white">{selectedMessage.subject}</p>
              </div>
            )}

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Message Content</span>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap mt-1">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex gap-2">
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedMessage.name)},%20this%20is%20SK%20Yadav.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re:%20${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Reply</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold"
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
