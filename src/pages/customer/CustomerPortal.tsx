import React, { useState } from 'react';
import { Ticket, User, TicketStatus } from '../../types';
import { 
  Plus, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Search, 
  Sparkles, ShieldCheck, Ticket as TicketIcon, LogIn, Lock, HelpCircle 
} from 'lucide-react';

interface CustomerPortalProps {
  currentUser: User | null;
  tickets: Ticket[];
  onOpenTicket: (ticket: Ticket) => void;
  onCreateTicketClick: () => void;
  onOpenAuthModal: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  currentUser,
  tickets,
  onOpenTicket,
  onCreateTicketClick,
  onOpenAuthModal
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // If user is logged in, show their tickets. If guest, show empty state or guest guidance
  const isLoggedIn = !!currentUser;
  const myTickets = isLoggedIn
    ? tickets.filter((t) => t.user_id === currentUser.id)
    : [];

  const filteredTickets = myTickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = myTickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = myTickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = myTickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Customer Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
              Customer Support Center
            </span>
            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full border border-slate-200">
              {isLoggedIn ? `Customer: ${currentUser.name}` : 'Welcome, Guest Visitor'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {isLoggedIn ? `Welcome back, ${currentUser.name}` : 'AI Customer Support Helpdesk'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {isLoggedIn
              ? 'Submit and track support inquiries below. Our Python TF-IDF Machine Learning engine automatically classifies your category and assigns support agents.'
              : 'Submit support inquiries with automated AI categorization and real-time support triage. Please sign in to create and track your support tickets.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onCreateTicketClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        </div>
      </div>

      {/* Guest Notice (If not logged in) */}
      {!isLoggedIn && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-blue-900">Sign in to track your personal tickets</span>
              <span className="bg-blue-200/70 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Customer Portal</span>
            </div>
            <p className="text-xs text-blue-700 max-w-xl">
              You are currently viewing the portal as a guest. Click <strong>Create New Ticket</strong> or <strong>Sign In</strong> to access your tickets, auto-classified by our TF-IDF machine learning model.
            </p>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        </div>
      )}

      {/* Metric Cards (When logged in) */}
      {isLoggedIn && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Awaiting Response</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{openCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">In Progress</span>
              <div className="text-xl font-bold text-amber-600 mt-0.5">{inProgressCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500">Resolved & Closed</span>
              <div className="text-xl font-bold text-emerald-600 mt-0.5">{resolvedCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Ticket List Header Controls (When logged in) */}
      {isLoggedIn && (
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search your tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Tickets ({myTickets.length})</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Table / List */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {!isLoggedIn ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Please Sign In to View Your Tickets</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Customers can sign in with their email to view open tickets, or create a new ticket right away.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 px-3.5 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
              <button
                onClick={onCreateTicketClick}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3.5 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Ticket
              </button>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <TicketIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No support tickets found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or status filter.'
                : 'You have not submitted any customer support inquiries yet.'}
            </p>
            {!search && statusFilter === 'ALL' && (
              <button
                onClick={onCreateTicketClick}
                className="mt-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Submit Your First Ticket
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onOpenTicket(ticket)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #{ticket.id}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority} Priority
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                      {ticket.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {ticket.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {ticket.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                    <span>Submitted: {ticket.created_at}</span>
                    {ticket.assigned_agent_name && (
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        Agent: {ticket.assigned_agent_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    <span>View Conversation</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
