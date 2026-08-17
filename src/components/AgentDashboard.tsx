import React, { useState } from 'react';
import { Ticket, User, TicketStatus, TicketCategory, TicketPriority, TicketSentiment } from '../types';
import { 
  Inbox, Clock, CheckCircle2, AlertTriangle, Search, Filter, 
  ArrowUpDown, ExternalLink, Sparkles, UserCheck, ShieldAlert 
} from 'lucide-react';

interface AgentDashboardProps {
  currentUser: User;
  tickets: Ticket[];
  allAgents: User[];
  onOpenTicket: (ticket: Ticket) => void;
  onUpdateStatus: (ticketId: number, status: TicketStatus) => void;
  onAssignAgent: (ticketId: number, agentId: number | null) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  currentUser,
  tickets,
  allAgents,
  onOpenTicket,
  onUpdateStatus,
  onAssignAgent
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sentimentFilter, setSentimentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [onlyMyAssigned, setOnlyMyAssigned] = useState(false);

  // Summary Metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const highPriorityCount = tickets.filter(t => t.priority === 'High').length;

  // Filter Pipeline
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toString().includes(search);

    const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    const matchesSentiment = sentimentFilter === 'ALL' || ticket.sentiment === sentimentFilter;
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesAssigned = !onlyMyAssigned || ticket.assigned_agent === currentUser.id;

    return matchesSearch && matchesCategory && matchesPriority && matchesSentiment && matchesStatus && matchesAssigned;
  });

  const getPriorityBadge = (prio: TicketPriority) => {
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

  const getSentimentBadge = (sent: TicketSentiment) => {
    switch (sent) {
      case 'Negative':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
      
      {/* Top Banner with Role Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
              {currentUser.role === 'admin' ? 'Admin Master Console' : 'Support Agent Workspace'}
            </span>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200">
              {currentUser.department || 'Operations'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Ticket Management & AI Triage Center
          </h1>
        </div>

        {currentUser.role === 'agent' && (
          <button
            onClick={() => setOnlyMyAssigned(!onlyMyAssigned)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border ${
              onlyMyAssigned
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{onlyMyAssigned ? 'Showing: My Assigned Tickets' : 'Filter: Assigned to Me'}</span>
          </button>
        )}
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Tickets</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Open Tickets</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">{openCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">In Progress</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Resolved</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-rose-50/50 p-4 rounded-xl border border-rose-200 shadow-xs">
          <span className="text-xs text-rose-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            High Priority
          </span>
          <div className="text-2xl font-bold text-rose-700 mt-1">{highPriorityCount}</div>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket ID, title, problem keywords, or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {(search || categoryFilter !== 'ALL' || priorityFilter !== 'ALL' || sentimentFilter !== 'ALL' || statusFilter !== 'ALL' || onlyMyAssigned) && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('ALL');
                setPriorityFilter('ALL');
                setSentimentFilter('ALL');
                setStatusFilter('ALL');
                setOnlyMyAssigned(false);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 whitespace-nowrap transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-medium mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-medium mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Product">Product</option>
              <option value="Delivery">Delivery</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-medium mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 uppercase font-medium mb-1">Sentiment</label>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Sentiments</option>
              <option value="Negative">Negative (Urgent)</option>
              <option value="Neutral">Neutral</option>
              <option value="Positive">Positive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Title & Issue</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onOpenTicket(ticket)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      #{ticket.id}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{ticket.customer_name}</div>
                      <div className="text-[10px] text-slate-500">{ticket.customer_email}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {ticket.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {ticket.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {ticket.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border font-semibold ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border font-medium ${getSentimentBadge(ticket.sentiment)}`}>
                        {ticket.sentiment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.status}
                        onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                        className={`text-xs px-2 py-1 rounded border font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${getStatusBadge(ticket.status)}`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.assigned_agent || ''}
                        onChange={(e) => onAssignAgent(ticket.id, e.target.value ? Number(e.target.value) : null)}
                        className="bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {allAgents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTicket(ticket);
                        }}
                        className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 px-2.5 py-1 rounded text-xs font-semibold transition-colors border border-slate-200"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No tickets found matching the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
