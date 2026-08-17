import React from 'react';
import { DashboardStats } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface AnalyticsDashboardProps {
  stats: DashboardStats;
}

const CATEGORY_COLORS: Record<string, string> = {
  Billing: '#3b82f6',
  Technical: '#8b5cf6',
  Account: '#06b6d4',
  Product: '#10b981',
  Delivery: '#f59e0b',
  General: '#64748b'
};

const PRIORITY_COLORS: Record<string, string> = {
  High: '#f43f5e',
  Medium: '#f59e0b',
  Low: '#10b981'
};

const SENTIMENT_COLORS: Record<string, string> = {
  Negative: '#f43f5e',
  Neutral: '#64748b',
  Positive: '#10b981'
};

const STATUS_COLORS: Record<string, string> = {
  Open: '#3b82f6',
  'In Progress': '#f59e0b',
  Resolved: '#10b981',
  Closed: '#475569'
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats }) => {
  const resolutionRate = stats.total_tickets > 0
    ? Math.round((stats.resolved_tickets / stats.total_tickets) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Management Reporting
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Support System Analytics & AI Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual distribution of support ticket categories, urgency rankings, and sentiment polarity.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-medium">Resolution Rate</span>
            <div className="text-xl font-bold text-emerald-600">{resolutionRate}%</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Primary Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Tickets by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Tickets by Category</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">SQL GROUP BY</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.category_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {stats.category_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Tickets by Priority */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-slate-900">Tickets by Priority Urgency</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">NLP Ranking</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priority_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.priority_distribution.map((entry, index) => (
                    <Cell key={`prio-cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Sentiment Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Customer Sentiment Polarity</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Lexicon Analyzer</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sentiment_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {stats.sentiment_distribution.map((entry, index) => (
                    <Cell key={`sent-cell-${index}`} fill={SENTIMENT_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Legend formatter={(val) => <span className="text-xs font-medium text-slate-700">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Lifecycle Status Pipeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-slate-900">Ticket Status Pipeline</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Lifecycle Pipeline</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.status_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.status_distribution.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={STATUS_COLORS[entry.name] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
