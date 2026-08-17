import React from 'react';
import { Sparkles, Brain, Cpu, MessageSquare, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  onOpenCreateTicket: () => void;
  onOpenAuthModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onOpenCreateTicket,
  onOpenAuthModal
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      
      {/* Hero */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Architecture & ML Pipeline
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          How AI Support Processes Every Ticket
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Combining Natural Language Processing (TF-IDF Vectorization) with smart ticket prioritization and an agent verification workflow.
        </p>
      </div>

      {/* 4 Step Process Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900">Customer Ingestion</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Customers submit issue details through our self-service portal or email gateway.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-sm">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900">TF-IDF Vectorizer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Text is tokenized, stopwords stripped, and mapped across 500+ n-gram vocabulary dimensions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-sm">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900">Classification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Logistic Regression predicts category (Billing, Technical, Account) & urgency in &lt;15ms.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm">
            04
          </div>
          <h3 className="text-base font-bold text-slate-900">Agent Desk Triage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verified agents receive pre-drafted suggested replies and resolve inquiries in record time.
          </p>
        </div>

      </div>

      {/* Feature Deep Dive */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Why We Built Machine Learning into Support Routing
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional ticketing tools force customers to guess dropdown categories, causing misrouted tickets and 24-48h resolution delays. Our TF-IDF classifier predicts the exact department and priority instantaneously.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-delay classification without manual intervention</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Single Admin security governance with Agent ID verification</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated suggested responses based on ticket context</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl space-y-4 font-mono text-xs text-slate-300">
            <div className="text-slate-400 font-sans font-bold uppercase tracking-wider text-[11px]">
              Pipeline Specification
            </div>
            <div className="space-y-2">
              <div><span className="text-purple-400">Model:</span> Multinomial Logistic Regression</div>
              <div><span className="text-purple-400">Feature Extraction:</span> TF-IDF (1-gram & 2-gram)</div>
              <div><span className="text-purple-400">Training Corpus:</span> 1,200+ Classified Customer Support Inquiries</div>
              <div><span className="text-purple-400">Inference Latency:</span> ~12ms (Client & Edge)</div>
              <div><span className="text-purple-400">Security Gate:</span> Admin Approved Agent ID Verification</div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800">
          <button
            onClick={onOpenCreateTicket}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
          >
            Try Submitting a Ticket
          </button>
          <button
            onClick={onOpenAuthModal}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer border border-slate-700"
          >
            Staff & Agent Login
          </button>
        </div>
      </div>

    </div>
  );
};
