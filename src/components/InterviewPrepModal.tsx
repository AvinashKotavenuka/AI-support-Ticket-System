import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../data/interviewPrepData';
import { InterviewQnA } from '../types';
import { GraduationCap, Search, CheckCircle, ChevronDown, ChevronUp, BookOpen, Sparkles, MessageSquare } from 'lucide-react';

export const InterviewPrepModal: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string>(INTERVIEW_QUESTIONS[0].id);

  const topics = ['ALL', ...Array.from(new Set(INTERVIEW_QUESTIONS.map((q) => q.topic)))];

  const filteredQuestions = INTERVIEW_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.answer.toLowerCase().includes(search.toLowerCase()) ||
      q.key_takeaway.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === 'ALL' || q.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Placement Viva & Technical Round Prep
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-200">
              BTech CS Focus
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Core Concepts & Interview Q&A Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Clear, structured explanations answering every fundamental technical question an interviewer could ask about React, Node.js, REST, MySQL, JWT, Bcrypt, and TF-IDF NLP.
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase font-medium">Total Q&A Topics</span>
          <div className="text-lg font-bold text-blue-600">{INTERVIEW_QUESTIONS.length} Questions</div>
        </div>
      </div>

      {/* Search & Topic Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search interview questions (e.g. JWT, TF-IDF, Bcrypt, MySQL vs MongoDB)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {topics.map((top) => (
            <button
              key={top}
              onClick={() => setSelectedTopic(top)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTopic === top
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className={`border rounded-xl transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white border-blue-400 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : q.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    {q.topic}
                  </span>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {q.question}
                  </h2>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-5 pt-1 space-y-3 border-t border-slate-100 text-xs text-slate-700">
                  <p className="font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {q.answer}
                  </p>

                  <div className="space-y-1.5 pl-1">
                    <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider block">
                      Key Technical Points to Mention:
                    </span>
                    <ul className="space-y-1 text-slate-600">
                      {q.bullet_points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-blue-900 block text-[11px]">10-Second Interview Elevator Answer:</span>
                      <p className="text-slate-700 text-xs italic mt-0.5">
                        "{q.key_takeaway}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
