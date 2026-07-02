import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Activity, 
  Heart, 
  ChevronRight, 
  Filter, 
  AlertTriangle,
  UserCheck2,
  CalendarDays
} from 'lucide-react';
import { Patient } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  onStartEncounter: (id: string) => void;
  searchValue: string;
}

export default function PatientsView({
  patients,
  onStartEncounter,
  searchValue
}: PatientsViewProps) {
  const [filterWard, setFilterWard] = useState<string>('All');

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                          p.mrn.toLowerCase().includes(searchValue.toLowerCase()) ||
                          p.chiefComplaint.toLowerCase().includes(searchValue.toLowerCase());
    const matchesWard = filterWard === 'All' ? true : p.ward.includes(filterWard);
    return matchesSearch && matchesWard;
  });

  const uniqueWards = ['All', 'Ward 1C', 'Ward 2A', 'Clinic B'];

  return (
    <div className="space-y-6 select-none">
      {/* Search and Filters Header */}
      <section className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-card-title text-[18px] font-bold text-text-primary">
            Active Patient Registry
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time ward telemetry and identification database.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 items-center">
          <Filter className="w-4 h-4 text-text-secondary mr-1" />
          {uniqueWards.map(ward => (
            <button
              key={ward}
              onClick={() => setFilterWard(ward)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filterWard === ward
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-text-secondary border-black/5 hover:bg-slate-50'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Patient Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => {
          const isHighTemp = p.vitals.temp >= 38.0;
          return (
            <div 
              key={p.id}
              className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between min-h-[280px]"
            >
              {/* Header inside card */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {p.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">MRN: {p.mrn}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                  p.urgency === 'Urgent' 
                    ? 'bg-danger-red/10 text-danger-red animate-pulse' 
                    : 'bg-warning-amber/10 text-warning-amber'
                }`}>
                  {p.urgency}
                </span>
              </div>

              {/* Vitals snapshot row */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50/70 p-3.5 rounded-2xl border border-black/5 my-4">
                <div className="text-center">
                  <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">Temp</span>
                  <span className={`font-bold font-mono text-xs ${isHighTemp ? 'text-danger-red' : 'text-primary'}`}>{p.vitals.temp}°C</span>
                </div>
                <div className="text-center border-l border-black/5">
                  <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">BP</span>
                  <span className="font-bold font-mono text-xs text-emerald-600">{p.vitals.bp}</span>
                </div>
                <div className="text-center border-l border-black/5">
                  <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">Pulse</span>
                  <span className="font-bold font-mono text-xs text-primary">{p.vitals.pulse}</span>
                </div>
                <div className="text-center border-l border-black/5">
                  <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">SpO2</span>
                  <span className="font-bold font-mono text-xs text-primary">{p.vitals.spo2}%</span>
                </div>
              </div>

              {/* Complaint details */}
              <div className="space-y-1.5 flex-1 mb-4">
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Chief Complaint</p>
                <p className="text-xs text-text-primary leading-relaxed font-semibold">
                  {p.chiefComplaint}
                </p>
                <p className="text-[10px] text-text-secondary font-medium italic">
                  Located in: {p.ward} • {p.arrivalText}
                </p>
              </div>

              {/* Triage Trigger Button */}
              <button
                onClick={() => onStartEncounter(p.id)}
                className="w-full py-3 bg-slate-50 border border-black/5 group-hover:bg-primary group-hover:text-white group-hover:border-primary text-text-primary rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Activity className="w-4 h-4" /> Start Diagnosis
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
