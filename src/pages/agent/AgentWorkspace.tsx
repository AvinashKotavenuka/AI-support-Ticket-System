import React, { useState } from 'react';
import { Ticket, User, TicketStatus, TicketCategory, TicketPriority, TicketSentiment } from '../../types';
import { 
  Inbox, Clock, CheckCircle2, AlertTriangle, Search, Filter, 
  ArrowUpDown, ExternalLink, Sparkles, UserCheck, ShieldAlert,
  ShieldCheck, Check, CornerDownRight, Tag, HelpCircle
} from 'lucide-react';

interface AgentWorkspaceProps {
  currentUser: User;
  tickets: Ticket[];
  allAgents: User[];
  onOpenTicket: (ticket: Ticket) => void;
  onUpdateStatus: (ticketId: number, status: TicketStatus) => void;
  onAssignAgent: (ticketId: number, agentId: number | null) => void;
}

export const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({
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
  const myAssignedCount = tickets.filter(t => t.assigned_agent === currentUser.id).length;

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

  const getSentimentBadge = (sentiment: TicketSentiment) => {
    switch (sentiment) {
      case 'Negative':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Positive':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Neutral':
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryBadge = (cat: TicketCategory) => {
    switch (cat) {
      case 'Billing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Technical':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Account':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Delivery':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Product':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Agent Workspace Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
              Support Agent Triage Desk
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Approved Agent ID #{currentUser.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            {currentUser.name} &bull; {currentUser.department || 'Support Desk'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Triage, investigate customer issues, inspect AI-generated suggested responses, and update resolution lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => setOnlyMyAssigned(!onlyMyAssigned)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
              onlyMyAssigned
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Assigned to Me ({myAssignedCount})</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Open Tickets</span>
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{openCount}</div>
          <span className="text-[10px] text-slate-400">Needs agent triage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</div>
          <span className="text-[10px] text-slate-400">Under active review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{highPriorityCount}</div>
          <span className="text-[10px] text-slate-400">Urgent customer issues</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
          <span className="text-[10px] text-slate-400">Successfully closed</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, customer name, title, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Delivery">Delivery</option>
              <option value="Product">Product</option>
              <option value="General">General</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Sentiments</option>
              <option value="Negative">Negative 😡</option>
              <option value="Neutral">Neutral 😐</option>
              <option value="Positive">Positive 😊</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">AI Category</th>
                <th className="py-3 px-4">AI Priority</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No tickets match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onOpenTicket(ticket)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500">
                          #{ticket.id}
                        </span>
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {ticket.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span className="font-medium text-slate-700">{ticket.customer_name}</span>
                        <span>&bull;</span>
                        <span>{ticket.created_at}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${getCategoryBadge(ticket.category)}`}>
                        <Sparkles className="w-2.5 h-2.5" />
                        {ticket.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getSentimentBadge(ticket.sentiment)}`}>
                        {ticket.sentiment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.status}
                        onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                        className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={ticket.assigned_agent ?? ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : null;
                          onAssignAgent(ticket.id, val);
                        }}
                        className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[140px]"
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
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Triage</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
