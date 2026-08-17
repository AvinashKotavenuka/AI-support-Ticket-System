import React, { useState } from 'react';
import { Ticket, User, TicketStatus } from '../types';
import { Plus, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Search, Sparkles } from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: User;
  tickets: Ticket[];
  onOpenTicket: (ticket: Ticket) => void;
  onCreateTicketClick: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  tickets,
  onOpenTicket,
  onCreateTicketClick
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Customer only sees their tickets
  const myTickets = tickets.filter((t) => t.user_id === currentUser.id);

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
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
            Customer Self-Service Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Submit support inquiries with automated AI categorization, real-time priority scoring, and instant resolution tracking.
          </p>
        </div>

        <button
          onClick={onCreateTicketClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Support Ticket</span>
        </button>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Open Tickets</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">{openCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">In Progress</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Resolved</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search my tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Open', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List / Grid */}
      {filteredTickets.length > 0 ? (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onOpenTicket(ticket)}
              className="bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-blue-300 p-5 rounded-xl cursor-pointer transition-all duration-150 group shadow-xs hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    #{ticket.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-slate-100 text-slate-700 border-slate-200">
                    {ticket.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {ticket.created_at}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                {ticket.title}
              </h2>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {ticket.description}
              </p>

              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px]">AI Sentiment: <strong className="font-semibold text-slate-800">{ticket.sentiment}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-slate-500 group-hover:text-blue-600 font-medium">
                  <span>View Details & History</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No Tickets Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || statusFilter !== 'ALL'
              ? 'No tickets match your filter criteria. Try resetting the search filters.'
              : 'You haven\'t submitted any support requests yet. Click the button below to submit your first issue.'}
          </p>
          {!(search || statusFilter !== 'ALL') && (
            <button
              onClick={onCreateTicketClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-block mt-2 shadow-xs"
            >
              + Create Support Ticket
            </button>
          )}
        </div>
      )}

    </div>
  );
};
