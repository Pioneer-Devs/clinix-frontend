import React, { useState } from 'react';
import { Activity, AlertCircle, Filter, UserPlus, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { ApiPatientCreate, Patient } from '../types';
import CreatePatientModal from './CreatePatientModal';

interface PatientsViewProps {
  patients: Patient[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onStartEncounter: (id: string) => void;
  onOpenWallet: (id: string) => void;
  onCreatePatient: (payload: ApiPatientCreate) => Promise<void>;
  searchValue: string;
}

export default function PatientsView({ patients, loading, error, onRetry, onStartEncounter, onOpenWallet, onCreatePatient, searchValue }: PatientsViewProps) {
  const [filterPriority, setFilterPriority] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) return <div className="h-[520px] rounded-2xl bg-white border border-border animate-pulse" />;
  if (error) {
    return (
      <div className="card-base p-8 text-center">
        <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
        <p className="text-sm font-bold text-text-primary">Patient queue could not load</p>
        <p className="text-xs text-text-secondary mt-1">{error}</p>
        <button onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">Retry</button>
      </div>
    );
  }

  const filtered = patients.filter(p => {
    const query = searchValue.toLowerCase();
    const matchesSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) || p.hospitalId.toLowerCase().includes(query) || p.chiefComplaint.toLowerCase().includes(query);
    const matchesPriority = filterPriority === 'All' || p.priority === filterPriority.toLowerCase();
    return matchesSearch && matchesPriority;
  });
  const activePatients = filtered.filter((patient) => patient.isActiveQueueItem || patient.latestEncounterStatus === 'rejected');
  const finalizedPatients = patients.filter((patient) => {
    const query = searchValue.toLowerCase();
    const matchesSearch = `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) || patient.hospitalId.toLowerCase().includes(query) || patient.chiefComplaint.toLowerCase().includes(query);
    return matchesSearch && patient.latestEncounterStatus === 'finalized';
  });

  function renderPatientCard(p: Patient, idx: number, finalized = false) {
    const isHighTemp = p.vitals.temp >= 38.0;
    const needsChanges = p.latestEncounterStatus === 'rejected';
    const handleCardClick = () => onStartEncounter(p.id);
    return (
      <motion.div
        key={p.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.04 }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleCardClick(); }}
        className={`card-base p-5 transition-all group hover:translate-y-[-2px] cursor-pointer hover:border-primary/30`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs ${p.priority === 'urgent' ? 'bg-accent' : 'gradient-primary'}`}>{p.firstName[0]}{p.lastName[0]}</div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">{p.firstName} {p.lastName}</h4>
              <p className="text-[10px] text-text-light font-mono">{p.hospitalId}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${finalized ? 'bg-success/10 text-success' : needsChanges ? 'bg-red-50 text-red-700' : p.priority === 'urgent' ? 'bg-accent/10 text-accent' : p.priority === 'waiting' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
            {finalized ? 'finalized' : needsChanges ? 'changes requested' : p.priority}
          </span>
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{p.chiefComplaint}</p>
        {needsChanges && (
          <p className="text-[10px] text-red-700 font-semibold mb-3">Supervisor requested changes. Reopen this encounter and resubmit.</p>
        )}
        {finalized && p.workingDiagnosis && (
          <p className="text-[10px] text-success font-semibold mb-3">Working diagnosis: {p.workingDiagnosis}</p>
        )}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { label: 'T', value: p.vitals.temp ? `${p.vitals.temp}` : '-', alert: isHighTemp },
            { label: 'BP', value: p.vitals.bp || '-' },
            { label: 'P', value: p.vitals.pulse || '-' },
            { label: 'O2', value: p.vitals.spo2 ? `${p.vitals.spo2}%` : '-' },
          ].map((vital) => (
            <div key={vital.label} className={`text-center py-1.5 rounded-lg border text-[10px] font-mono font-semibold ${vital.alert ? 'border-accent/30 bg-accent/5 text-accent' : 'border-border bg-bg-main text-text-secondary'}`}>
              <div className="text-[8px] text-text-light font-semibold mb-0.5">{vital.label}</div>
              {vital.value}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-text-light font-medium">
            <Activity className="w-3 h-3" />
            {p.waitingTime}m waiting - {p.age}{p.gender}
          </div>
          {!finalized ? (
            <button onClick={(e) => { e.stopPropagation(); onStartEncounter(p.id); }} className="px-3 py-1.5 bg-white border border-border text-text-secondary rounded-lg text-[10px] font-bold hover:gradient-primary hover:text-white hover:border-primary">Begin Intake</button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onOpenWallet(p.id); }} className="px-3 py-1.5 rounded-lg border border-success/20 bg-success/5 text-success text-[10px] font-bold hover:bg-success/10 cursor-pointer">Open Wallet QR</button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5 select-none flex flex-col h-full">
      <div className="card-base overflow-hidden flex flex-col sm:flex-row">
        <div className="p-4 border-b sm:border-b-0 sm:border-r border-border flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-text-primary">Patient Queue</h3>
          </div>
          <p className="text-[10px] text-text-secondary font-medium">Active patients returned from the Clinix backend</p>
        </div>
        <div className="flex gap-2 items-center p-3 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-text-light" />
          {['All', 'Urgent', 'Waiting', 'Routine'].map(priority => (
            <button key={priority} onClick={() => setFilterPriority(priority)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border ${filterPriority === priority ? 'gradient-primary text-white border-primary' : 'bg-white text-text-secondary border-border'}`}>{priority}</button>
          ))}
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-white text-[10px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register Patient
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Active Queue</h4>
            <span className="text-[10px] font-semibold text-text-light">{activePatients.length} patients</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePatients.map((p, idx) => renderPatientCard(p, idx))}
          </div>
          {activePatients.length === 0 && (
            <div className="card-base p-8 text-center text-xs text-text-secondary">No active patients match the current filters.</div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Finalized Patients</h4>
            <span className="text-[10px] font-semibold text-text-light">{finalizedPatients.length} records</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finalizedPatients.map((p, idx) => renderPatientCard(p, idx, true))}
          </div>
          {finalizedPatients.length === 0 && (
            <div className="card-base p-8 text-center text-xs text-text-secondary">No finalized patients match the current search.</div>
          )}
        </section>
      </div>

      {filtered.length === 0 && (
        <div className="card-base p-12 text-center">
          <UserPlus className="w-8 h-8 text-text-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-text-secondary mb-1">No patients found</p>
          <p className="text-xs text-text-light mb-4">Register your first patient to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 gradient-primary text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register New Patient
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreatePatientModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreatePatient}
        />
      )}
    </div>
  );
}
