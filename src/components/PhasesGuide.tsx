import React, { useState } from 'react';
import { PHASE_GUIDE } from '../data/interviewPrepData';
import { PhaseItem } from '../types';
import { BookOpen, CheckCircle, Terminal, AlertTriangle, ChevronRight, Copy, Check, Layers } from 'lucide-react';

export const PhasesGuide: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseItem>(PHASE_GUIDE[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Step-by-Step Architecture Guide
            </span>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-200">
              10 Complete Phases
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Full-Stack Project Development Phases & Implementation Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Detailed breakdown of every phase: folder structure, code snippets, execution commands, testing instructions, and common errors with fixes.
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase font-medium">Selected Phase</span>
          <div className="text-base font-bold text-amber-600">Phase {selectedPhase.phase_number} of 10</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Phases Timeline (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-1">
            Project Phases (1 to 10)
          </span>
          <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
            {PHASE_GUIDE.map((phase) => {
              const isSelected = selectedPhase.id === phase.id;
              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-700 font-mono font-bold">Phase {phase.phase_number}</span>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 truncate">
                    {phase.title.split(': ')[1] || phase.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {phase.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Phase Header */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Phase {selectedPhase.phase_number}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {selectedPhase.title}
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedPhase.description}
            </p>
          </div>

          {/* Folder Structure & Code File */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Folder & File Layout
              </span>
              <pre className="text-[11px] font-mono text-blue-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100 overflow-x-auto">
                {selectedPhase.folder_structure}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                Installation & Run Commands
              </span>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto">
                {selectedPhase.run_commands.map((cmd, i) => (
                  <div key={i} className="leading-snug">{cmd}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 font-mono">
                {selectedPhase.code_filename}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPhase.code_snippet);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-200 bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto max-h-72">
              {selectedPhase.code_snippet}
            </pre>
          </div>

          {/* Simple Explanation Points */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
              Important Code Concepts in Simple Terms
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedPhase.explanation_points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testing Instructions & Common Errors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Testing Checklist */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                How to Test This Phase
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedPhase.test_instructions.map((test, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-mono text-[10px] font-bold mt-0.5">[{i + 1}]</span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Errors & Fixes */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Common Errors & How to Fix
              </span>
              <div className="space-y-2">
                {selectedPhase.common_errors.map((item, i) => (
                  <div key={i} className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 text-xs space-y-1">
                    <div className="text-rose-800 font-mono text-[10px] font-semibold">{item.error}</div>
                    <div className="text-slate-700 text-[11px]"><strong className="text-amber-700">Fix:</strong> {item.fix}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
