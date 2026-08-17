import React, { useState } from 'react';
import { User, Ticket } from '../../types';
import { DatabaseService } from '../../services/database';
import { 
  Shield, ShieldCheck, UserCheck, UserX, AlertCircle, CheckCircle2, 
  Crown, KeyRound, Mail, Clock, Lock, Users, Sparkles, Filter, 
  RefreshCw, Check, X, ShieldAlert, FileText, BarChart
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  allUsers: User[];
  tickets: Ticket[];
  onUserUpdate: () => void;
  onOpenTicket: (ticket: Ticket) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  allUsers,
  tickets,
  onUserUpdate,
  onOpenTicket
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'agents' | 'users' | 'overview'>('agents');
  const [filterText, setFilterText] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleApproveAgent = (agentId: number, name: string) => {
    DatabaseService.approveAgent(agentId);
    onUserUpdate();
    showNotice(`✅ Agent ID #${agentId} (${name}) has been APPROVED. The agent can now log in and triage tickets.`);
  };

  const handleRevokeAgent = (agentId: number, name: string) => {
    DatabaseService.revokeAgent(agentId);
    onUserUpdate();
    showNotice(`⚠️ Agent ID #${agentId} (${name}) access has been REVOKED.`);
  };

  const agents = allUsers.filter(u => u.role === 'agent');
  const pendingAgents = agents.filter(u => u.is_approved === false);
  const approvedAgents = agents.filter(u => u.is_approved !== false);
  const customers = allUsers.filter(u => u.role === 'customer');
  const adminUser = allUsers.find(u => u.role === 'admin') || currentUser;

  const filteredUsersList = allUsers.filter(u => 
    u.name.toLowerCase().includes(filterText.toLowerCase()) ||
    u.email.toLowerCase().includes(filterText.toLowerCase()) ||
    u.role.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3 text-purple-400" />
              Single System Administrator Authority
            </span>
            <span className="text-xs text-slate-400 font-mono">User ID #{currentUser.id}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-white flex items-center gap-2">
            Admin Governance & Agent Approvals
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            As the single system administrator, you govern agent access authorizations, verify user IDs, review role hierarchies, and monitor system-wide ticketing throughput.
          </p>
        </div>

        {/* Pending Approval Counter Badge */}
        <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl flex items-center gap-3 shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base ${
            pendingAgents.length > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {pendingAgents.length}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Pending Agent IDs</div>
            <div className="text-[11px] text-slate-400">
              {pendingAgents.length > 0 ? 'Requires Admin review' : 'All Agent IDs approved'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">{actionSuccess}</div>
        </div>
      )}

      {/* Admin Subtabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 w-fit">
          <button
            onClick={() => setActiveSubTab('agents')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'agents'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Agent ID Approvals ({agents.length})
            {pendingAgents.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingAgents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            All Registered Users ({allUsers.length})
          </button>

          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Admin Security Policy
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
          <span>Admin Profile: <strong>{adminUser.name}</strong> ({adminUser.email})</span>
        </div>
      </div>

      {/* Subtab 1: Agent ID Approvals */}
      {activeSubTab === 'agents' && (
        <div className="space-y-6">
          
          {/* Section: Pending Agent Approvals */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pending Agent Registration Requests ({pendingAgents.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    These agent accounts cannot log into the agent dashboard until approved by Admin.
                  </p>
                </div>
              </div>
            </div>

            {pendingAgents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <span className="font-semibold text-slate-700">No pending agent requests</span>
                <p className="text-[11px] text-slate-400 mt-0.5">All registered support agents have valid authorization credentials.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingAgents.map((agent) => (
                  <div key={agent.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Agent ID #{agent.id}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{agent.name}</span>
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          PENDING APPROVAL
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-3 font-mono">
                        <span>Email: {agent.email}</span>
                        <span>&bull;</span>
                        <span>Department: {agent.department || 'Support Desk'}</span>
                        <span>&bull;</span>
                        <span>Registered: {agent.created_at}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleApproveAgent(agent.id, agent.name)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Agent ID
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Active Approved Agents */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Approved & Active Support Agents ({approvedAgents.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Authorized for Ticket Triage</span>
            </div>

            <div className="divide-y divide-slate-100">
              {approvedAgents.map((agent) => (
                <div key={agent.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Agent ID #{agent.id}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{agent.name}</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Active & Authorized
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-3 font-mono">
                      <span>Email: {agent.email}</span>
                      <span>&bull;</span>
                      <span>Department: {agent.department}</span>
                      <span>&bull;</span>
                      <span>Assigned Tickets: {tickets.filter(t => t.assigned_agent === agent.id).length}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleRevokeAgent(agent.id, agent.name)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      Suspend Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Subtab 2: All Registered Users Table */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Identity Directory (RBAC)</h3>
              <p className="text-xs text-slate-500">Comprehensive view of all roles across customer, agent, and single admin.</p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Filter users..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredUsersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      #{user.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : user.role === 'agent'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {user.role === 'admin' ? 'Single Admin' : user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {user.department || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {user.role === 'agent' ? (
                        user.is_approved ? (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                            Approved
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                            Pending Approval
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-500">Instant Access</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {user.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Architecture & Security Policy */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">1. Single Admin Enforcement Policy</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In this architecture, exactly <strong>one single Admin</strong> is allowed in the entire system (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">admin@support.com</code>). Additional attempts to register an administrator role are rejected with HTTP <code className="bg-slate-100 px-1 rounded">403 Forbidden</code> to maintain strict separation of duties.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800">Admin Privileges:</div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px]">
                <li>Approve or suspend Agent IDs</li>
                <li>View full RBAC user directory</li>
                <li>Inspect cross-departmental tickets and AI predictions</li>
                <li>Configure TF-IDF NLP model thresholds and endpoints</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">2. Agent ID Approval Security Gate</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When support staff register as <strong>Agents</strong>, their accounts are initialized with <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-700">is_approved = FALSE</code>. Attempting to log in prior to approval triggers an approval roadblock. Once the Admin approves the Agent ID, access is immediately unlocked.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800">Customer Privileges:</div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px]">
                <li>Zero-wait self-service registration and immediate ticket creation</li>
                <li>Access restricted strictly to their own tickets (<code className="text-blue-700">WHERE user_id = ?</code>)</li>
                <li>Real-time automated AI triage categorization & priority feedback</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
