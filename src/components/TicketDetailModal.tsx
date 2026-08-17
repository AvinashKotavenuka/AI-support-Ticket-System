import React, { useState } from 'react';
import { Ticket, User, TicketStatus } from '../types';
import { 
  X, CheckCircle, Clock, AlertTriangle, MessageSquare, 
  Send, UserPlus, Sparkles, Check, Edit3, ShieldAlert 
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allAgents: User[];
  onUpdateStatus: (ticketId: number, status: TicketStatus) => void;
  onAssignAgent: (ticketId: number, agentId: number | null) => void;
  onAddResponse: (ticketId: number, message: string, isInternal: boolean) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  currentUser,
  allAgents,
  onUpdateStatus,
  onAssignAgent,
  onAddResponse
}) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [customResponse, setCustomResponse] = useState(ticket?.suggested_response || '');

  if (!isOpen || !ticket) return null;

  const isAgentOrAdmin = currentUser.role === 'agent' || currentUser.role === 'admin';

  const handleUseSuggested = () => {
    setReplyMessage(ticket.suggested_response);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    onAddResponse(ticket.id, replyMessage, isInternalNote);
    setReplyMessage('');
    setIsInternalNote(false);
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'High':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Low':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    }
  };

  const getSentimentBadge = (sent: string) => {
    switch (sent) {
      case 'Negative':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/80';
      case 'Positive':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80';
      case 'Neutral':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'In Progress':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Resolved':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'Closed':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 text-blue-400 border border-slate-700 rounded">
              #{ticket.id}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(ticket.status)}`}>
              {ticket.status}
            </span>
            <span className="text-xs text-slate-400">
              Submitted on {ticket.created_at}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Title & Customer Information */}
          <div>
            <h1 className="text-lg font-bold text-white mb-2 leading-snug">
              {ticket.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
              <div>
                Customer: <span className="text-slate-200 font-medium">{ticket.customer_name}</span> ({ticket.customer_email})
              </div>
              {ticket.assigned_agent_name && (
                <div>
                  Assigned Agent: <span className="text-blue-300 font-medium">{ticket.assigned_agent_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI / NLP Diagnostic Card */}
          <div className="bg-slate-950/80 border border-blue-950/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  AI & NLP Automated Diagnostic
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Multinomial Classifier
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Category</span>
                <span className="font-semibold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50 inline-block">
                  {ticket.category}
                </span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Priority</span>
                <span className={`font-semibold px-2 py-0.5 rounded border inline-block ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Sentiment</span>
                <span className={`font-semibold px-2 py-0.5 rounded border inline-block ${getSentimentBadge(ticket.sentiment)}`}>
                  {ticket.sentiment}
                </span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Triage Action</span>
                <span className="text-slate-300 font-medium">Auto-Routed</span>
              </div>
            </div>

            {/* AI Suggested Response Box */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-400">
                  AI Suggested Response Template:
                </span>
                {isAgentOrAdmin && (
                  <button
                    type="button"
                    onClick={handleUseSuggested}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium bg-blue-950/60 hover:bg-blue-900/60 px-2 py-0.5 rounded border border-blue-800/60 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Insert Into Reply
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{ticket.suggested_response}"
              </p>
            </div>
          </div>

          {/* Ticket Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Customer Problem Statement
            </h3>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Agent Workflow Controls */}
          {isAgentOrAdmin && (
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Agent Triage Controls
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Update Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Assign Agent</label>
                  <select
                    value={ticket.assigned_agent || ''}
                    onChange={(e) => onAssignAgent(ticket.id, e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {allAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.department || agent.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {ticket.status !== 'Resolved' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onUpdateStatus(ticket.id, 'Resolved')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark Ticket as Resolved
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Conversation History Thread */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Activity & Responses Thread ({ticket.responses?.length || 0})
            </h3>

            {ticket.responses && ticket.responses.length > 0 ? (
              <div className="space-y-3">
                {ticket.responses.map((resp) => {
                  const isAgent = resp.user_role === 'agent' || resp.user_role === 'admin';
                  return (
                    <div
                      key={resp.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        resp.is_internal_note
                          ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                          : isAgent
                          ? 'bg-blue-950/20 border-blue-900/60 text-slate-200'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">
                            {resp.user_name}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono ${
                            isAgent ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {resp.user_role}
                          </span>
                          {resp.is_internal_note && (
                            <span className="bg-amber-900 text-amber-200 px-1.5 py-0.2 rounded text-[10px] font-medium">
                              Internal Note
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {resp.created_at}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{resp.message}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800/80 text-center text-xs text-slate-500">
                No replies posted yet. Use the response box below to write back to the customer.
              </div>
            )}
          </div>

          {/* Reply Box Form */}
          <form onSubmit={handleSendReply} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isAgentOrAdmin ? 'Compose Reply or Internal Agent Note' : 'Reply to Support Team'}
              </label>
              <textarea
                rows={3}
                required
                placeholder={isAgentOrAdmin ? "Type your response to the customer or click 'Insert Into Reply' above..." : "Type your message..."}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              {isAgentOrAdmin ? (
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Post as Private Internal Note (Hidden from Customer)</span>
                </label>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={!replyMessage.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Response</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
