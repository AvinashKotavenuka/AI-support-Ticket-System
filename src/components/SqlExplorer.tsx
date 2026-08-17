import React, { useState } from 'react';
import { SQL_QUERY_PRESETS, DB_SCHEMA_DOCS, SqlQueryPreset } from '../data/sqlPlaygroundData';
import { Ticket, User, TicketResponse } from '../types';
import { Database, Play, Table, Key, HelpCircle, CheckCircle, Terminal, RefreshCw } from 'lucide-react';

interface SqlExplorerProps {
  tickets: Ticket[];
  users: User[];
  responses: TicketResponse[];
}

export const SqlExplorer: React.FC<SqlExplorerProps> = ({ tickets, users, responses }) => {
  const [selectedPreset, setSelectedPreset] = useState<SqlQueryPreset>(SQL_QUERY_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'query-runner' | 'schema' | 'tables'>('query-runner');
  const [activeTable, setActiveTable] = useState<'tickets' | 'users' | 'responses'>('tickets');
  const [customQuery, setCustomQuery] = useState(SQL_QUERY_PRESETS[0].query);
  const [executionResult, setExecutionResult] = useState<any[] | null>(null);

  const handleSelectPreset = (preset: SqlQueryPreset) => {
    setSelectedPreset(preset);
    setCustomQuery(preset.query);
    executeSimulatedSql(preset.id);
  };

  const executeSimulatedSql = (presetId?: string) => {
    const id = presetId || selectedPreset.id;

    if (id === 'group-by-category') {
      const map: Record<string, { count: number; high: number }> = {};
      tickets.forEach(t => {
        if (!map[t.category]) map[t.category] = { count: 0, high: 0 };
        map[t.category].count += 1;
        if (t.priority === 'High') map[t.category].high += 1;
      });
      const res = Object.entries(map).map(([category, data]) => ({
        category,
        ticket_count: data.count,
        high_priority_count: data.high
      })).sort((a, b) => b.ticket_count - a.ticket_count);
      setExecutionResult(res);
    } else if (id === 'join-tickets-users') {
      const res = tickets.map(t => {
        const u = users.find(user => user.id === t.user_id);
        const a = users.find(agent => agent.id === t.assigned_agent);
        return {
          ticket_id: t.id,
          title: t.title.substring(0, 35) + '...',
          category: t.category,
          priority: t.priority,
          status: t.status,
          customer_name: u ? u.name : t.customer_name,
          agent_name: a ? a.name : 'Unassigned'
        };
      });
      setExecutionResult(res);
    } else if (id === 'unresolved-high-priority') {
      const res = tickets
        .filter(t => t.priority === 'High' && (t.status === 'Open' || t.status === 'In Progress'))
        .map(t => ({
          id: t.id,
          title: t.title,
          category: t.category,
          sentiment: t.sentiment,
          created_at: t.created_at
        }));
      setExecutionResult(res);
    } else if (id === 'sentiment-breakdown') {
      const map: Record<string, { pos: number; neu: number; neg: number }> = {};
      tickets.forEach(t => {
        if (!map[t.category]) map[t.category] = { pos: 0, neu: 0, neg: 0 };
        if (t.sentiment === 'Positive') map[t.category].pos += 1;
        if (t.sentiment === 'Neutral') map[t.category].neu += 1;
        if (t.sentiment === 'Negative') map[t.category].neg += 1;
      });
      const res = Object.entries(map).map(([category, data]) => ({
        category,
        positive_cnt: data.pos,
        neutral_cnt: data.neu,
        negative_cnt: data.neg
      }));
      setExecutionResult(res);
    } else {
      // Default fallback
      setExecutionResult(tickets.slice(0, 5));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Relational Database Explorer
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200">
              MySQL 8.0 Schema & Queries
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            MySQL Schema, ER Relations & Live Query Playground
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inspect the production SQL schema definitions, understand table relationships, and practice essential database interview queries.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setActiveTab('query-runner');
              if (!executionResult) executeSimulatedSql();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'query-runner'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SQL Query Runner
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'schema'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Schema DDL
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'tables'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Tables
          </button>
        </div>
      </div>

      {/* Mode 1: Query Runner */}
      {activeTab === 'query-runner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Preset Queries Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
              Placement Interview Queries
            </span>
            <div className="space-y-2">
              {SQL_QUERY_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-xs ${
                    selectedPreset.id === preset.id
                      ? 'bg-blue-50/80 border-blue-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-900">{preset.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {preset.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Query Editor & Result Panel */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    SQL Query Editor
                  </span>
                </div>
                <button
                  onClick={() => executeSimulatedSql()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>

              <textarea
                rows={5}
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full bg-slate-900 font-mono text-xs text-emerald-400 p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              {/* Interview Explainer Tip */}
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-blue-900 block">Interview Key Tip:</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {selectedPreset.interview_tip}
                  </p>
                </div>
              </div>
            </div>

            {/* Execution Result Table */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 uppercase tracking-wider">
                  Query Execution Results ({executionResult ? executionResult.length : 0} rows)
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-medium">
                  Execution Time: ~2.4ms (Indexed Scan)
                </span>
              </div>

              <div className="overflow-x-auto bg-slate-50 rounded-lg border border-slate-200">
                {executionResult && executionResult.length > 0 ? (
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase border-b border-slate-200 font-mono font-semibold">
                      <tr>
                        {Object.keys(executionResult[0]).map((col) => (
                          <th key={col} className="p-2.5">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 font-mono text-[11px]">
                      {executionResult.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white transition-colors">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="p-2.5 text-slate-800">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    Click "Execute SQL" to run the query.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Mode 2: Schema DDL */}
      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DB_SCHEMA_DOCS.map((table) => (
            <div key={table.name} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Table className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 font-mono">{table.name}</h3>
              </div>
              <p className="text-xs text-slate-500">{table.description}</p>

              <div className="space-y-1.5">
                {table.columns.map((col) => (
                  <div key={col.name} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-800">{col.name}</span>
                      <span className="text-[10px] text-blue-600 font-mono font-semibold">{col.type}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{col.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 3: Live Tables */}
      {activeTab === 'tables' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTable('tickets')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTable === 'tickets' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              tickets ({tickets.length} rows)
            </button>
            <button
              onClick={() => setActiveTable('users')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTable === 'users' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              users ({users.length} rows)
            </button>
            <button
              onClick={() => setActiveTable('responses')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTable === 'responses' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ticket_responses ({responses.length} rows)
            </button>
          </div>

          <div className="overflow-x-auto bg-slate-50 rounded-lg border border-slate-200">
            {activeTable === 'tickets' && (
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-mono border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">id</th>
                    <th className="p-2.5">user_id</th>
                    <th className="p-2.5">title</th>
                    <th className="p-2.5">category</th>
                    <th className="p-2.5">priority</th>
                    <th className="p-2.5">sentiment</th>
                    <th className="p-2.5">status</th>
                    <th className="p-2.5">assigned_agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-white transition-colors">
                      <td className="p-2.5 text-blue-700 font-bold">#{t.id}</td>
                      <td className="p-2.5">{t.user_id}</td>
                      <td className="p-2.5 max-w-xs truncate">{t.title}</td>
                      <td className="p-2.5">{t.category}</td>
                      <td className="p-2.5">{t.priority}</td>
                      <td className="p-2.5">{t.sentiment}</td>
                      <td className="p-2.5">{t.status}</td>
                      <td className="p-2.5">{t.assigned_agent || 'NULL'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'users' && (
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-mono border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">id</th>
                    <th className="p-2.5">name</th>
                    <th className="p-2.5">email</th>
                    <th className="p-2.5">role</th>
                    <th className="p-2.5">department</th>
                    <th className="p-2.5">created_at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white transition-colors">
                      <td className="p-2.5 text-blue-700 font-bold">#{u.id}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{u.name}</td>
                      <td className="p-2.5">{u.email}</td>
                      <td className="p-2.5">{u.role}</td>
                      <td className="p-2.5">{u.department || 'N/A'}</td>
                      <td className="p-2.5 text-slate-500">{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'responses' && (
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-mono border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">id</th>
                    <th className="p-2.5">ticket_id</th>
                    <th className="p-2.5">user_id</th>
                    <th className="p-2.5">author</th>
                    <th className="p-2.5">message</th>
                    <th className="p-2.5">is_internal_note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {responses.map((r) => (
                    <tr key={r.id} className="hover:bg-white transition-colors">
                      <td className="p-2.5 text-blue-700 font-bold">#{r.id}</td>
                      <td className="p-2.5">#{r.ticket_id}</td>
                      <td className="p-2.5">{r.user_id}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{r.user_name}</td>
                      <td className="p-2.5 max-w-sm truncate">{r.message}</td>
                      <td className="p-2.5">{r.is_internal_note ? 'TRUE' : 'FALSE'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
