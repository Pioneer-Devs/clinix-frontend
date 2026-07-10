import React from 'react';
import { Activity, AlertCircle, Award, Brain, CheckCircle2, Clock, Edit3, Hourglass, Plus, Target } from 'lucide-react';
import { ActivityEvent, ApiPortfolio, Patient } from '../types';

interface DashboardProps {
  patients: Patient[];
  logs: ActivityEvent[];
  portfolio: ApiPortfolio | null;
  pendingReviewCount: number;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onStartEncounter: (patientId: string) => void;
  onOpenReview: () => void;
  onViewAllQueue: () => void;
  onViewPortfolio: () => void;
}

function Skeleton() {
  return (
    <div className="space-y-5">
      <div className="h-28 rounded-2xl bg-white border border-border animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-white border border-border animate-pulse" />
        <div className="h-80 rounded-2xl bg-white border border-border animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardView({
  patients,
  logs,
  portfolio,
  pendingReviewCount,
  loading,
  error,
  onRetry,
  onStartEncounter,
  onOpenReview,
  onViewAllQueue,
  onViewPortfolio,
}: DashboardProps) {
  if (loading) return <Skeleton />;

  const activePatients = patients.filter((p) => p.isActiveQueueItem || p.latestEncounterStatus === 'rejected');

  if (error) {
    return (
      <div className="card-base p-8 text-center">
        <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
        <p className="text-sm font-bold text-text-primary">Dashboard could not load</p>
        <p className="text-xs text-text-secondary mt-1">{error}</p>
        <button onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">Retry</button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Encounters', value: portfolio?.total_encounters || 0, icon: Activity },
    { label: 'Diagnostic Accuracy', value: `${Math.round((portfolio?.diagnostic_accuracy || 0) * 100)}%`, icon: Target },
    { label: 'Verified Credits', value: portfolio?.total_credits || 0, icon: Award },
    { label: 'Pending Reviews', value: pendingReviewCount, icon: Clock },
  ];

  const competencies = Object.entries(portfolio?.competencies || {});

  return (
    <div className="space-y-6">
      <div className="card-base overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex justify-between items-center bg-white">
          <span className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">System Telemetry</span>
          <div className="flex items-center gap-2">
            <button onClick={onOpenReview} className="px-3 py-1.5 border border-border text-text-primary bg-white hover:bg-bg-main rounded text-[10px] font-bold uppercase">Review Pending</button>
            <button onClick={() => onStartEncounter(patients[0]?.id || '')} className="px-3 py-1.5 bg-sidebar-bg text-white rounded text-[10px] font-bold hover:bg-primary flex items-center gap-1 uppercase">
              <Plus className="w-3 h-3" /> New Encounter
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border bg-white">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase text-text-secondary">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-text-primary tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-base overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex justify-between items-center bg-white">
            <span className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Active Patient Queue</span>
            <button onClick={onViewAllQueue} className="text-[10px] font-bold text-primary hover:underline uppercase">View All</button>
          </div>
          <div className="divide-y divide-border-light bg-white">
            {activePatients.slice(0, 6).map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-3 items-center hover:bg-bg-main/50">
                <div className="col-span-3 min-w-0">
                  <h4 className="text-[11px] font-bold text-text-primary uppercase truncate">{p.firstName} {p.lastName}</h4>
                  <p className="text-[9px] text-text-secondary mt-0.5 truncate uppercase">{p.hospitalId}</p>
                </div>
                <div className="col-span-5 min-w-0">
                  <p className="text-[10px] font-bold text-text-primary uppercase truncate">{p.age} {p.gender}</p>
                  <p className="text-[9px] text-text-secondary mt-0.5 truncate">{p.chiefComplaint}</p>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${p.priority === 'urgent' ? 'bg-danger/10 text-danger' : p.priority === 'waiting' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>{p.priority}</span>
                </div>
                <div className="col-span-2 text-right">
                  <button onClick={() => onStartEncounter(p.id)} className="px-3 py-1.5 bg-white border border-border text-text-secondary rounded text-[9px] font-bold hover:bg-bg-main uppercase">Begin Intake</button>
                </div>
              </div>
            ))}
            {activePatients.length === 0 && <div className="p-8 text-center text-xs text-text-secondary">No active patients in the queue.</div>}
          </div>
        </div>

        <div className="card-base overflow-hidden flex-1 bg-white">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">System Logs</span>
          </div>
          <div className="divide-y divide-border-light max-h-[330px] overflow-y-auto thin-scrollbar">
            {logs.slice(0, 8).map((log) => {
              const Icon = log.type === 'encounter_approved' ? CheckCircle2 : log.type === 'wallet_push' ? Brain : log.type === 'encounter_complete' ? Edit3 : Hourglass;
              return (
                <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-bg-main/50 bg-white">
                  <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-bold text-text-primary uppercase leading-tight truncate">{log.title}</h4>
                      <span className="text-[9px] font-bold text-text-light flex-shrink-0 uppercase">{log.timeAgo}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-0.5 truncate">{log.description}</p>
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && <div className="p-8 text-center text-xs text-text-secondary">No activity has been logged yet.</div>}
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden bg-white">
        <div className="px-5 py-3 border-b border-border flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase text-text-secondary tracking-widest flex items-center gap-2">
            <Award className="w-3.5 h-3.5" /> Portfolio Overview
          </span>
          <button onClick={onViewPortfolio} className="text-[10px] font-bold text-primary hover:underline uppercase">View Full Portfolio</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-border-light">
          {competencies.map(([key, raw]) => {
            const score = typeof raw === 'number' ? Math.min(100, raw * 10) : raw.score;
            const encounters = typeof raw === 'number' ? raw : raw.encounters;
            return (
              <div key={key} className="p-4 text-center hover:bg-bg-main/50">
                <p className="text-xl font-extrabold text-primary">{score}</p>
                <p className="text-[10px] font-semibold text-text-secondary capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-[9px] text-text-light mt-0.5">{encounters} cases</p>
              </div>
            );
          })}
          {competencies.length === 0 && <div className="col-span-full p-8 text-center text-xs text-text-secondary">No competency data yet.</div>}
        </div>
      </div>
    </div>
  );
}
