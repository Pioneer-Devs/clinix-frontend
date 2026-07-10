import React from 'react';
import { AlertCircle, BarChart3, CheckSquare, FileDown, FileText, ShieldCheck } from 'lucide-react';
import { ActivityEvent, ApiPortfolioStats } from '../types';

interface ReportsViewProps {
  stats: ApiPortfolioStats | null;
  logs: ActivityEvent[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  searchValue: string;
}

export default function ReportsView({ stats, logs, loading, error, onRetry, searchValue }: ReportsViewProps) {
  if (loading) return <div className="h-[520px] rounded-2xl bg-white border border-border animate-pulse" />;
  if (error) {
    return (
      <div className="card-base p-8 text-center">
        <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
        <p className="text-sm font-bold text-text-primary">Reports could not load</p>
        <p className="text-xs text-text-secondary mt-1">{error}</p>
        <button onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">Retry</button>
      </div>
    );
  }

  const totalEncounters = Object.values(stats?.encounters || {}).reduce((sum, value) => sum + value, 0);
  const finalized = stats?.encounters?.finalized || 0;
  const pending = stats?.encounters?.pending_review || 0;
  const credits = Object.values(stats?.credits || {}).reduce((sum, value) => sum + value, 0);
  const reportStats = [
    { label: 'Overall Efficacy', value: totalEncounters ? `${Math.round((finalized / totalEncounters) * 100)}%` : '0%', trend: 'System' },
    { label: 'Unresolved Flags', value: pending, trend: 'Pending' },
    { label: 'Diagnostic Audits', value: totalEncounters, trend: 'Logged' },
    { label: 'Credit Records', value: credits, trend: 'Verified' },
  ];
  const filteredLogs = logs.filter((log) => {
    const query = searchValue.toLowerCase();
    return log.title.toLowerCase().includes(query) || log.description.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-5 select-none flex flex-col h-full">
      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-text-primary">Clinical Audit & Performance Reports</h3>
          </div>
          <p className="text-[10px] text-text-secondary font-medium">Compliance tracking from clinical activity and portfolio statistics</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {reportStats.map((stat) => (
            <div key={stat.label} className="p-4">
              <p className="text-[10px] text-text-secondary font-medium mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-extrabold text-text-primary leading-none">{stat.value}</span>
                <span className="text-[10px] font-bold text-primary mb-0.5">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
        <div className="card-base overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-primary" />
              <h4 className="text-xs font-bold text-text-primary">Regulatory Activity Trail</h4>
            </div>
            <span className="text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">Live Audit</span>
          </div>
          <div className="divide-y divide-border-light">
            {filteredLogs.slice(0, 8).map((item) => (
              <div key={item.id} className="p-4 hover:bg-bg-main/50">
                <div className="flex justify-between items-start gap-3 mb-1.5">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <h5 className="text-xs font-bold text-text-primary capitalize">{item.title}</h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-success/10 text-success">{item.timeAgo}</span>
                </div>
                <p className="text-[10px] text-text-secondary pl-6.5 ml-[26px]">{item.description}</p>
              </div>
            ))}
            {filteredLogs.length === 0 && <div className="p-8 text-center text-xs text-text-secondary">No clinical activity matches your search.</div>}
          </div>
        </div>

        <div className="card-base overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <h4 className="text-xs font-bold text-text-primary">Outcome Analytics</h4>
          </div>
          <div className="p-5">
            <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
              Clinical encounter counts show {finalized} finalized encounters out of {totalEncounters} total tracked encounters.
            </p>
            <div className="space-y-3">
              {Object.entries(stats?.encounters || {}).map(([label, value]) => {
                const width = totalEncounters ? Math.round((value / totalEncounters) * 100) : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-text-secondary w-24 capitalize">{label.replace(/_/g, ' ')}</span>
                    <div className="flex-1 h-3 bg-bg-main rounded-full overflow-hidden"><div className="h-full rounded-full gradient-primary" style={{ width: `${width}%` }} /></div>
                    <span className="text-[10px] font-bold text-text-primary w-8 text-right">{value}</span>
                  </div>
                );
              })}
              {Object.keys(stats?.encounters || {}).length === 0 && <p className="text-xs text-text-secondary">No encounter analytics are available yet.</p>}
            </div>
          </div>
          <div className="mt-auto px-5 py-3 border-t border-border flex justify-center">
            <button className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" /> Download Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
