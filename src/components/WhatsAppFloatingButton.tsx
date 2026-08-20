import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface WhatsAppFloatingButtonProps {
  settings: SiteSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(
    "Hello SK Yadav, I saw your portfolio and would like to discuss a website project."
  );

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(customMsg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const presetMessages = [
    "Hello SK Yadav, I saw your portfolio and would like to discuss a website project.",
    "Hi SK! I need a quotation for a Full Stack Web Application.",
    "Hey SK Yadav, are you currently available for freelance work?",
    "Hi, I need help fixing bugs and optimizing speed on our website."
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        id="whatsapp-floating-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-6 left-6 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group flex items-center gap-2"
        aria-label="WhatsApp SK Yadav"
      >
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-semibold pr-1">
          WhatsApp SK Yadav
        </span>
      </button>

      {/* WhatsApp Quick Popup */}
      {isOpen && (
        <div
          id="whatsapp-popup-card"
          className="fixed bottom-22 left-6 z-50 w-80 sm:w-96 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">Chat on WhatsApp</h4>
                <p className="text-[11px] text-emerald-400 font-medium">+{settings.whatsappNumber} (Online)</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Choose or edit your message:</label>
            
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {presetMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setCustomMsg(msg)}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-colors border ${
                    customMsg === msg
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>

            <textarea
              value={customMsg}
              onChange={e => setCustomMsg(e.target.value)}
              rows={2}
              className="w-full mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      )}
    </>
  );
};
