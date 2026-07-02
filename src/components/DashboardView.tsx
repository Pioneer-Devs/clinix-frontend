import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ChevronRight, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Hourglass,
  ArrowUpRight,
  ShieldAlert,
  Play,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { Patient, SystemLog } from '../types';

interface DashboardProps {
  patients: Patient[];
  logs: SystemLog[];
  onStartEncounter: (patientId: string) => void;
  onOpenReview: () => void;
  onViewAllQueue: () => void;
  onViewPortfolio: () => void;
}

export default function DashboardView({
  patients,
  logs,
  onStartEncounter,
  onOpenReview,
  onViewAllQueue,
  onViewPortfolio
}: DashboardProps) {
  const [showAutonomousModal, setShowAutonomousModal] = useState(false);

  // Statistics counters
  const stats = [
    { 
      label: 'Total Encounters', 
      value: '142', 
      trend: '12%', 
      points: 'M0,35 Q10,32 20,38 T40,30 T60,35 T80,25 T100,28',
      color: 'text-primary'
    },
    { 
      label: 'Verified Credits', 
      value: '840', 
      trend: '5%', 
      points: 'M0,20 Q15,10 30,25 T60,15 T100,30',
      color: 'text-primary'
    },
    { 
      label: 'Avg. Accuracy', 
      value: '94%', 
      trend: '2%', 
      points: 'M0,30 L20,25 L40,32 L60,15 L80,20 L100,10',
      color: 'text-primary'
    },
    { 
      label: 'Patients Waiting', 
      value: '8', 
      trend: null,
      points: null,
      color: 'text-warning-amber'
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="mesh-gradient p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider font-semibold">
                {stat.label}
              </span>
              {stat.trend && (
                <div className="flex items-center gap-0.5 text-success-green bg-success-green/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </div>
              )}
            </div>

            <div className="flex items-end justify-between relative z-10 mt-2">
              <p className={`text-[36px] font-extrabold tracking-tight leading-none ${stat.color}`}>
                {stat.value}
              </p>
              
              {stat.points ? (
                <svg className="w-20 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d={stat.points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              ) : (
                <div className="flex gap-1.5 items-end pb-1.5">
                  <div className="w-1.5 h-6 bg-warning-amber/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-10 bg-warning-amber/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-8 bg-warning-amber/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Grid: Active Queue & AI Insights Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Queue List */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white/50">
              <div className="flex items-center gap-3">
                <h3 className="font-card-title text-[18px] font-bold text-text-primary">
                  Patient Queue
                </h3>
                <span className="px-3 py-1 bg-slate-100 text-primary text-[10px] font-bold rounded-full tracking-wider uppercase">
                  12 Active
                </span>
              </div>
              <button 
                onClick={onViewAllQueue}
                className="text-primary font-body-semibold text-xs hover:bg-primary/5 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                View All Queue
              </button>
            </div>

            <div className="divide-y divide-black/5">
              {patients.slice(0, 3).map((p, i) => (
                <div 
                  key={p.id}
                  onClick={() => onStartEncounter(p.id)}
                  className="p-6 flex items-center gap-6 hover:bg-primary/5 transition-all relative group cursor-pointer"
                >
                  {i === 0 && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-2 transition-all"></div>
                  )}
                  
                  {/* Initials avatar */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-extrabold ${
                    i === 0 
                      ? 'bg-primary/10 text-primary' 
                      : i === 1 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-tertiary-fixed text-tertiary-container'
                  }`}>
                    {p.avatarInitials}
                  </div>

                  {/* Diagnosis description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-body-semibold text-[15px] font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                        {p.name}
                      </h4>
                      {i === 0 && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded leading-none">
                          Next Up
                        </span>
                      )}
                    </div>
                    <p className="font-body-base text-xs text-text-secondary truncate">
                      {p.age}{p.gender[0]} • {p.chiefComplaint} • {p.ward}
                    </p>
                  </div>

                  {/* Status labels */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-xl font-semibold text-[10px] uppercase tracking-wider ${
                      p.urgency === 'Urgent' 
                        ? 'bg-danger-red/10 text-danger-red' 
                        : 'bg-warning-amber/10 text-warning-amber'
                    }`}>
                      {p.urgency}
                    </span>
                    <span className="text-[10px] text-text-secondary font-medium italic">
                      {p.arrivalText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-black/5 text-center text-xs text-text-secondary">
            Select any patient in the active queue to initiate their high-fidelity diagnostic clinical encounter.
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="lg:col-span-4 ai-panel-glass rounded-3xl p-6 relative overflow-hidden flex flex-col group text-white">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-container/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform"></div>

          <div className="flex justify-between items-center mb-8 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-xl border border-white/20">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <h3 className="font-card-title text-[18px] font-bold tracking-tight">
                AI Clinical Agent
              </h3>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white mcp-glow border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-ping"></span>
              MCP Active
            </div>
          </div>

          <div className="space-y-4 z-10 flex-1">
            <div className="ai-card-glass p-5 rounded-2xl border-l-4 border-white transition-all cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4.5 h-4.5 text-white" />
                <p className="font-body-semibold text-[13px] font-bold text-white">Critical Suggestion</p>
              </div>
              <p className="font-body-base text-xs text-white/8 transition-relaxed">
                4 prenatal screenings pending for high-risk patients in Zone B. Systematic delay detected.
              </p>
            </div>

            <div className="ai-card-glass p-5 rounded-2xl border-l-4 border-blue-200 transition-all cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4.5 h-4.5 text-blue-100" />
                <p className="font-body-semibold text-[13px] font-bold text-white">Public Health Alert</p>
              </div>
              <p className="font-body-base text-xs text-white/8 transition-relaxed">
                Cluster pattern of Malaria detected in Ward 4. Recommend immediate vector control screening.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowAutonomousModal(true)}
            className="mt-6 w-full py-3.5 bg-white text-primary rounded-2xl font-bold text-xs hover:bg-slate-100 shadow-xl shadow-primary-container/10 transition-all z-10 cursor-pointer text-center uppercase tracking-wider"
          >
            Review Autonomous Actions
          </button>
        </div>
      </div>

      {/* Bottom Row: System Logs & Portfolio Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Stream Logs */}
        <div className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-black/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-card-title text-[18px] font-bold text-text-primary">
              System Logs
            </h3>
            <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              Real-time Stream
            </span>
          </div>

          <div className="relative space-y-6 pl-10 before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/25 before:via-slate-200 before:to-transparent">
            {logs.slice(0, 3).map((log) => {
              const Icon = log.type === 'verified' ? CheckCircle2 : log.type === 'autosave' ? Edit3 : Hourglass;
              const colorClass = log.type === 'verified' ? 'bg-success-green' : log.type === 'autosave' ? 'bg-primary' : 'bg-slate-400';
              
              return (
                <div key={log.id} className="relative flex items-start gap-4 group">
                  <div className={`absolute -left-10 w-8 h-8 rounded-xl ${colorClass} flex items-center justify-center border-4 border-white shadow-sm transition-transform group-hover:scale-110 z-10`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body-semibold text-xs font-bold text-text-primary">
                      {log.title}
                    </h4>
                    <p className="font-body-base text-[11px] text-text-secondary mt-1">
                      {log.description}
                    </p>
                  </div>
                  <span className="font-label-sm text-[10px] text-text-secondary font-semibold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-black/5 flex-shrink-0">
                    {log.timeAgo}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Preview Card */}
        <div 
          onClick={onViewPortfolio}
          className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-black/5 p-6 flex flex-col justify-between group cursor-pointer hover:border-primary/20 transition-all select-none"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-card-title text-[18px] font-bold text-text-primary">
                Clinical Portfolio
              </h3>
              <p className="text-[11px] text-text-secondary font-medium">Core Residency Diagnostics mapping</p>
            </div>
            
            <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary-container text-white text-[10px] font-bold rounded-full shadow-md shadow-primary-container/10 uppercase tracking-wider">
              Level 4 Resident
            </span>
          </div>

          {/* Interactive Spider/Radar chart mockup using highly stylized clean SVGs */}
          <div className="flex-1 flex items-center justify-center py-4 relative">
            <div className="relative w-44 h-44 border border-black/5 rounded-full flex items-center justify-center animate-pulse-slow">
              <div className="absolute inset-0 border border-primary/5 rounded-full scale-75"></div>
              <div className="absolute inset-0 border border-primary/5 rounded-full scale-50"></div>
              
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
                {/* Spokes background */}
                <line className="stroke-slate-100" x1="50" x2="50" y1="10" y2="90" strokeWidth="0.5"></line>
                <line className="stroke-slate-100" x1="10" x2="90" y1="50" y2="50" strokeWidth="0.5"></line>
                
                {/* Simulated radar polygon representing actual scores */}
                <polygon 
                  points="50,15 85,35 80,75 50,90 20,70 15,30" 
                  className="fill-primary/15 stroke-primary transition-all group-hover:fill-primary/25" 
                  strokeWidth="1.5"
                />
                
                {/* Data marks */}
                <circle cx="50" cy="15" r="2" className="fill-white stroke-primary" strokeWidth="1.5" />
                <circle cx="85" cy="35" r="2" className="fill-white stroke-primary" strokeWidth="1.5" />
                <circle cx="80" cy="75" r="2" className="fill-white stroke-primary" strokeWidth="1.5" />
                <circle cx="50" cy="90" r="2" className="fill-white stroke-primary" strokeWidth="1.5" />
                <circle cx="20" cy="70" r="2" className="fill-white stroke-primary" strokeWidth="1.5" />
                <circle cx="15" cy="30" r="2" className="fill-white stroke-primary" strokeWidth="1.5" />

                {/* Micro labeling */}
                <text x="50" y="8" className="text-[5px] font-bold fill-text-secondary uppercase text-center" textAnchor="middle">History</text>
                <text x="92" y="37" className="text-[5px] font-bold fill-text-secondary uppercase" textAnchor="start">Exam</text>
                <text x="83" y="80" className="text-[5px] font-bold fill-text-secondary uppercase" textAnchor="start">Diagnosis</text>
                <text x="50" y="97" className="text-[5px] font-bold fill-text-secondary uppercase" textAnchor="middle">Treatment</text>
                <text x="14" y="75" className="text-[5px] font-bold fill-text-secondary uppercase" textAnchor="end">Comm</text>
                <text x="10" y="32" className="text-[5px] font-bold fill-text-secondary uppercase" textAnchor="end">Proc</text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
            <div className="text-center">
              <p className="text-primary font-black text-xl tracking-tight leading-none">88/100</p>
              <p className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold mt-1">
                Clinical Competency
              </p>
            </div>
            <div className="text-center border-l border-black/5">
              <p className="text-primary font-black text-xl tracking-tight leading-none">92%</p>
              <p className="text-[9px] text-text-secondary uppercase tracking-wider font-semibold mt-1">
                Peer Review Score
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous AI Modal Screen */}
      {showAutonomousModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAutonomousModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative z-10 text-text-primary"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">Autonomous Clinical Recommendations</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              The AI Co-pilot is monitoring clinical logs and ward flows in real-time. Here are the active background agents:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-black/5 rounded-2xl">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Malaria Vector Screening Draft</span>
                  <span className="text-success-green">95% Confident</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-normal">
                  Ward 4 malaria cluster detected. Auto-scheduling sanitary vector sweep and patient preventative screenings.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-black/5 rounded-2xl">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Antiepileptic / Anti-emetic Protocol Alignment</span>
                  <span className="text-primary">82% Confident</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-normal">
                  Identified 12 pending cases with potential NSAID-induced clinical conflicts. Drafting correction templates.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAutonomousModal(false)}
              className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-2xl text-xs hover:bg-primary-container transition-colors"
            >
              Close Intelligence Log
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
