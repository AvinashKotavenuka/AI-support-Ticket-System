import React, { useState, useEffect } from 'react';
import { User, MLPredictionResult } from '../types';
import { runLocalNLP, runGroqNLP } from '../services/nlpClassifier';
import { Sparkles, AlertCircle, Bot, Zap, X } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, useGroq: boolean) => Promise<void>;
  currentUser: User;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useGroq, setUseGroq] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewNLP, setPreviewNLP] = useState<MLPredictionResult | null>(null);

  // Real-time NLP inference preview as the user types
  useEffect(() => {
    if (!title.trim() && !description.trim()) {
      setPreviewNLP(null);
      return;
    }

    const timer = setTimeout(() => {
      const result = runLocalNLP(title, description);
      setPreviewNLP(result);
    }, 200);

    return () => clearTimeout(timer);
  }, [title, description]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title, description, useGroq);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample quick-fill templates for rapid demonstration
  const quickTemplates = [
    {
      label: '💳 Billing Issue',
      title: 'Payment deducted but subscription not active',
      desc: 'My credit card was debited $49 for the monthly plan, but my account dashboard still indicates Payment Failed. Please credit or refund ASAP.'
    },
    {
      label: '⚠️ Technical Outage',
      title: '500 Server Error on invoice export API',
      desc: 'Our automated pipeline received a 500 internal server error when requesting the monthly invoice export endpoint. Production is blocked.'
    },
    {
      label: '🔒 Locked Account',
      title: '2FA SMS code not receiving, locked out',
      desc: 'I attempted login three times but the SMS OTP code is not arriving on my registered mobile device. Urgent access needed.'
    },
    {
      label: '📦 Delivery Inquiry',
      title: 'Package marked delivered but not received',
      desc: 'Tracking ID #TRK-8842 claims delivery completed yesterday afternoon, but no package was delivered to our security desk.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-lg font-semibold text-white">Create Support Ticket</h2>
            <p className="text-xs text-slate-400">
              Submitting as <span className="text-blue-400 font-medium">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Fill Demos */}
        <div className="px-6 pt-4 pb-2 bg-slate-900/30 border-b border-slate-800/60">
          <span className="text-xs font-medium text-slate-400 block mb-2">Quick Sample Prompts for Testing:</span>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(tmpl.title);
                  setDescription(tmpl.desc);
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 transition-colors"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Ticket Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Double payment deduction on order #9382"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Detailed Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your issue with exact details, error messages, or steps taken..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* AI NLP Live Preview Box */}
          {previewNLP && (
            <div className="p-4 bg-slate-950/70 rounded-lg border border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    AI Auto-Triage Live Preview
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  TF-IDF + Logistic Regression
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Predicted Category</span>
                  <span className="font-semibold text-blue-400">{previewNLP.category}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Predicted Priority</span>
                  <span className={`font-semibold ${
                    previewNLP.priority === 'High' ? 'text-rose-400' :
                    previewNLP.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {previewNLP.priority}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Sentiment</span>
                  <span className={`font-semibold ${
                    previewNLP.sentiment === 'Negative' ? 'text-rose-400' :
                    previewNLP.sentiment === 'Positive' ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {previewNLP.sentiment}
                  </span>
                </div>
              </div>

              {previewNLP.keywords_detected && previewNLP.keywords_detected.length > 0 && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span>NLP Keywords Detected:</span>
                  {previewNLP.keywords_detected.map((kw, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs bg-slate-900/90 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px] mb-1">Auto-Suggested Response Template:</span>
                <p className="text-slate-200 text-xs italic">
                  "{previewNLP.suggested_response}"
                </p>
              </div>
            </div>
          )}

          {/* Groq Cloud LLM Option Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-medium text-slate-200">
                  Enable Groq LLaMA-3.3 NLP Mode
                </div>
                <div className="text-[11px] text-slate-400">
                  Uses cloud LLM inference alongside local TF-IDF model
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useGroq}
                onChange={(e) => setUseGroq(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running ML Pipeline...</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
