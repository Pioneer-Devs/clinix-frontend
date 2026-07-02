import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  X, 
  Activity, 
  Check, 
  BrainCircuit, 
  Terminal, 
  Lock, 
  Sparkles, 
  RotateCcw,
  CloudLightning,
  CheckCircle2,
  CalendarCheck,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Patient } from '../types';

interface NewEncounterProps {
  patients: Patient[];
  selectedPatientId: string;
  onPatientSelect: (id: string) => void;
  onBack: () => void;
  onFinalize: (patientId: string, diagnosis: string, vitals: any) => void;
}

export default function NewEncounterView({
  patients,
  selectedPatientId,
  onPatientSelect,
  onBack,
  onFinalize
}: NewEncounterProps) {
  // Find current patient
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Editable states
  const [temp, setTemp] = useState(patient.vitals.temp);
  const [bp, setBp] = useState(patient.vitals.bp);
  const [pulse, setPulse] = useState(patient.vitals.pulse);
  const [spo2, setSpo2] = useState(patient.vitals.spo2);
  const [chiefComplaint, setChiefComplaint] = useState(patient.chiefComplaint);
  const [symptoms, setSymptoms] = useState<string[]>(['Fever', 'Headache', 'Chills']);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [showAddSymptomInput, setShowAddSymptomInput] = useState(false);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Emergency'>('Moderate');
  const [physicalExam, setPhysicalExam] = useState('Document systematic assessment findings...');
  const [workingDiagnosis, setWorkingDiagnosis] = useState('');
  const [labs, setLabs] = useState<string[]>(['RDT for Malaria', 'FBC (Full Blood Count)']);
  const [showAddLab, setShowAddLab] = useState(false);
  const [newLabText, setNewLabText] = useState('');
  const [managementPlan, setManagementPlan] = useState('Medications, dosing, education...');
  const [isSyncing, setIsSyncing] = useState(false);

  // Dynamic Intelligence Simulator
  const [confidence, setConfidence] = useState(92);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('Malaria (Uncomplicated)');
  const [differentials, setDifferentials] = useState([
    { name: 'Typhoid Fever', pct: 15.4 },
    { name: 'Lassa Fever', pct: 4.2 }
  ]);

  // Sync state with loaded patient
  useEffect(() => {
    if (patient) {
      setTemp(patient.vitals.temp);
      setBp(patient.vitals.bp);
      setPulse(patient.vitals.pulse);
      setSpo2(patient.vitals.spo2);
      setChiefComplaint(patient.chiefComplaint);
      setWorkingDiagnosis(
        patient.workingDiagnosis || 
        `Likely uncomplicated malaria given high-grade fever, headache, and rigors in endemic region. RDT requested.`
      );
    }
  }, [patient]);

  // Reactive logic simulator: Vitals change AI diagnosis scores!
  useEffect(() => {
    let conf = 70;
    let mainDiag = 'Malaria (Uncomplicated)';
    let diffs = [
      { name: 'Typhoid Fever', pct: 15.4 },
      { name: 'Lassa Fever', pct: 4.2 }
    ];

    // Score based on symptoms
    const hasFever = symptoms.map(s => s.toLowerCase()).includes('fever') || temp > 38.0;
    const hasHeadache = symptoms.map(s => s.toLowerCase()).includes('headache');
    const hasChills = symptoms.map(s => s.toLowerCase()).includes('chills');

    if (hasFever) conf += 12;
    if (hasHeadache) conf += 5;
    if (hasChills) conf += 5;

    // Severe vital sign impact
    if (temp >= 39.5) {
      mainDiag = 'Severe Malaria (Cerebral Risk)';
      conf = Math.min(conf + 8, 98);
      diffs = [
        { name: 'Bacterial Sepsis', pct: 28.5 },
        { name: 'Typhoid Encephalopathy', pct: 18.2 }
      ];
    } else if (temp < 37.0) {
      mainDiag = 'Viral Upper Respiratory Infection';
      conf = 85;
      diffs = [
        { name: 'Influenza Type A', pct: 32.1 },
        { name: 'Malaria (Incubating)', pct: 10.5 }
      ];
    }

    if (spo2 < 94) {
      mainDiag = 'Malaria with Severe Respiratory Distress';
      conf = Math.min(conf + 5, 96);
      diffs = [
        { name: 'Acute Pneumonia', pct: 44.2 },
        { name: 'Pulmonary Embolism', pct: 8.4 }
      ];
    }

    setConfidence(conf);
    setPrimaryDiagnosis(mainDiag);
    setDifferentials(diffs);
  }, [temp, bp, pulse, spo2, symptoms]);

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymptomText.trim()) {
      setSymptoms([...symptoms, newSymptomText.trim()]);
      setNewSymptomText('');
      setShowAddSymptomInput(false);
    }
  };

  const handleRemoveSymptom = (idx: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== idx));
  };

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabText.trim()) {
      setLabs([...labs, newLabText.trim()]);
      setNewLabText('');
      setShowAddLab(false);
    }
  };

  const handleRemoveLab = (idx: number) => {
    setLabs(labs.filter((_, i) => i !== idx));
  };

  const triggerSaveDraft = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] select-none">
      {/* Search systems in Header Action or Secondary Title */}
      <div className="flex items-center justify-between pb-6 border-b border-black/5 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-black/5 rounded-xl text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-page-title text-[20px] font-bold text-text-primary">
              Intake Diagnostics Form
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Encounter Workflow for Teaching Hospital
            </p>
          </div>
        </div>

        {/* Toggle patient dropdown selector */}
        <div className="relative">
          <select 
            value={selectedPatientId} 
            onChange={(e) => onPatientSelect(e.target.value)}
            className="bg-white border border-black/5 rounded-2xl px-4 py-2.5 text-xs font-bold text-primary outline-none focus:ring-4 focus:ring-primary/10 shadow-sm cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                Switch Patient: {p.name} ({p.mrn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 flex-1">
        {/* Left column: Intake Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Details */}
          <section className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-4">
              Patient Identification
            </label>
            <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-black/5 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary font-bold text-[18px]">
                {patient.avatarInitials}
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">{patient.name}</h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  MRN: {patient.mrn} | {patient.gender}, {patient.age} yrs | Blood: {patient.bloodType}
                </p>
              </div>
            </div>
          </section>

          {/* Vitals Feed Panel */}
          <section className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                Vital Sign Monitor
              </h3>
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                Live Feed // SENSOR_ARRAY_01
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Temperature */}
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Temp (°C)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    step="0.1"
                    value={temp} 
                    onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                    className="vitals-value bg-transparent text-rose-500 border-none w-20 p-0 focus:ring-0 select-all"
                  />
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${temp >= 38.0 ? 'bg-rose-500/10 text-rose-500' : 'bg-green-500/10 text-green-500'}`}>
                    {temp >= 38.0 ? 'HIGH' : 'NORM'}
                  </span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">BP (mmHg)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={bp} 
                    onChange={(e) => setBp(e.target.value)}
                    className="vitals-value bg-transparent text-emerald-400 border-none w-24 p-0 focus:ring-0 select-all"
                  />
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none bg-emerald-500/10 text-emerald-400">
                    NORM
                  </span>
                </div>
              </div>

              {/* Pulse */}
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Pulse (bpm)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={pulse} 
                    onChange={(e) => setPulse(parseInt(e.target.value) || 0)}
                    className="vitals-value bg-transparent text-blue-400 border-none w-16 p-0 focus:ring-0 select-all"
                  />
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none bg-blue-500/10 text-blue-400">
                    STBL
                  </span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">SpO2 (%)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={spo2} 
                    onChange={(e) => setSpo2(parseInt(e.target.value) || 0)}
                    className="vitals-value bg-transparent text-emerald-400 border-none w-16 p-0 focus:ring-0 select-all"
                  />
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${spo2 >= 95 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                    {spo2 >= 95 ? 'OPT' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[9px] text-slate-600 mt-3 flex justify-between">
              <span>* Click and type directly to simulate clinical vital adjustments</span>
              <button 
                onClick={() => {
                  setTemp(patient.vitals.temp);
                  setBp(patient.vitals.bp);
                  setPulse(patient.vitals.pulse);
                  setSpo2(patient.vitals.spo2);
                }}
                className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset Defaults
              </button>
            </div>
          </section>

          {/* Presentation Slate */}
          <section className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="font-bold text-sm text-text-primary">Clinical Presentation</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Ambient Listening</span>
              </div>
            </div>

            {/* Chief complaint textarea */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Chief Complaint
              </label>
              <textarea 
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-black/5 rounded-2xl p-4 text-xs text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50 font-medium"
                placeholder="Describe the reason for the visit..."
              />
            </div>

            {/* Associated symptoms */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Associated Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, idx) => (
                  <span 
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-black/5 text-text-primary rounded-xl text-xs font-semibold"
                  >
                    {symptom}
                    <button 
                      onClick={() => handleRemoveSymptom(idx)}
                      className="p-0.5 hover:bg-black/10 rounded-full text-text-secondary hover:text-danger-red cursor-pointer transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {showAddSymptomInput ? (
                  <form onSubmit={handleAddSymptom} className="flex gap-1.5">
                    <input 
                      type="text"
                      autoFocus
                      value={newSymptomText}
                      onChange={(e) => setNewSymptomText(e.target.value)}
                      placeholder="Add symptom..."
                      className="border border-black/5 rounded-xl px-2.5 py-1 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button 
                      type="submit"
                      className="p-1.5 bg-primary text-white rounded-xl hover:bg-primary-container cursor-pointer text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddSymptomInput(false)}
                      className="p-1.5 hover:bg-black/5 rounded-xl text-text-secondary cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setShowAddSymptomInput(true)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-black/10 text-text-secondary hover:text-primary hover:border-primary rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Symptom
                  </button>
                )}
              </div>
            </div>

            {/* Severity Assessment */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Severity Assessment
              </label>
              <div className="flex flex-wrap gap-2 p-1 bg-slate-50 border border-black/5 rounded-2xl w-fit">
                {(['Mild', 'Moderate', 'Severe', 'Emergency'] as const).map((sev) => {
                  const isActive = severity === sev;
                  return (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-white text-primary shadow-sm border border-black/5' 
                          : sev === 'Emergency' 
                            ? 'text-text-secondary hover:text-danger-red hover:bg-danger-red/5' 
                            : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Diagnosis & Detailed Notes */}
          <section className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Physical Examination
              </label>
              <textarea 
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-black/5 rounded-2xl p-4 text-xs text-text-primary outline-none focus:ring-4 focus:ring-primary/10 font-medium"
              />
            </div>

            <div className="space-y-2 bg-rose-50/15 border-l-4 border-rose-500 p-4 rounded-2xl">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                Working Diagnosis <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              </label>
              <textarea 
                value={workingDiagnosis}
                onChange={(e) => setWorkingDiagnosis(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-text-primary text-xs font-semibold leading-relaxed"
              />
              <div className="text-[10px] text-rose-400 mt-1">
                * Real-time validation active: AI assisted clinical drafting with diagnostic accuracy logs.
              </div>
            </div>
          </section>

          {/* Lab Investigations & Actions */}
          <section className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Requested Investigations
              </label>
              <div className="flex flex-wrap gap-2">
                {labs.map((lab, idx) => (
                  <span 
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-xl text-xs font-bold border border-primary/10"
                  >
                    {lab}
                    <button 
                      onClick={() => handleRemoveLab(idx)}
                      className="p-0.5 hover:bg-primary/10 rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {showAddLab ? (
                  <form onSubmit={handleAddLab} className="flex gap-1.5">
                    <input 
                      type="text"
                      autoFocus
                      value={newLabText}
                      onChange={(e) => setNewLabText(e.target.value)}
                      placeholder="Enter investigation..."
                      className="border border-black/5 rounded-xl px-2.5 py-1 text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button 
                      type="submit"
                      className="p-1.5 bg-primary text-white rounded-xl hover:bg-primary-container cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddLab(false)}
                      className="p-1.5 hover:bg-black/5 rounded-xl text-text-secondary cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setShowAddLab(true)}
                    className="flex items-center gap-1 px-4 py-1.5 border border-dashed border-black/10 text-text-secondary hover:text-primary hover:border-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    + Order Labs
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Management Plan
              </label>
              <textarea 
                value={managementPlan}
                onChange={(e) => setManagementPlan(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-black/5 rounded-2xl p-4 text-xs text-text-primary outline-none focus:ring-4 focus:ring-primary/10 font-medium"
              />
            </div>
          </section>
        </div>

        {/* Right column: AI Analysis Sidebar (Connected) */}
        <aside className="lg:col-span-4 ai-panel-gradient text-white p-6 rounded-3xl h-full flex flex-col gap-6 shadow-xl border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <BrainCircuit className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-bold text-base text-white/90 tracking-tight">
                Clinical Intelligence
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-blue-400">Connected</span>
            </div>
          </div>

          {/* Confidence Circle Indicator */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-md">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              {/* Spinning / progress ring */}
              <svg className="w-full h-full -rotate-90">
                <circle className="text-white/5" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-blue-500 transition-all duration-700 ease-out" 
                  cx="72" 
                  cy="72" 
                  fill="transparent" 
                  r="64" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 64}`}
                  strokeDashoffset={`${2 * Math.PI * 64 * (1 - confidence / 100)}`}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tighter text-white">{confidence}%</span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-white/50 mt-1">Confidence</span>
              </div>
            </div>
            <h4 className="text-blue-200 font-bold text-base tracking-tight">{primaryDiagnosis}</h4>
            <p className="text-[10px] text-white/50 mt-1.5 leading-relaxed">
              Neural models aligned fever patterns and diagnostic indexes with high clinical relevance.
            </p>
          </div>

          {/* Differentials Progress indicators */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-white/40">Differential Diagnoses</h5>
              <Activity className="w-3.5 h-3.5 text-white/30" />
            </div>
            
            <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10">
              {differentials.map((diff, i) => (
                <div key={diff.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white/80">{diff.name}</span>
                    <span className="font-mono text-blue-300">{diff.pct}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${diff.pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-blue-400' : 'bg-blue-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MCP active agents */}
          <div className="space-y-3 mt-1">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-white/40">Active MCP Agents</h5>
              <Terminal className="w-3.5 h-3.5 text-white/30" />
            </div>

            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:bg-black/55 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">INVENTORY_CHECKER</span>
                </div>
                <p className="text-white/60">$ ping stock_api/coartem</p>
                <p className="text-white/40 mt-1">&gt; 24 units available in Central Pharm</p>
                <span className="inline-block mt-2 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-400 rounded-md uppercase font-bold">
                  Ready to Order
                </span>
              </div>

              <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:bg-black/55 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-400 font-bold">SCHEDULER_SVC</span>
                </div>
                <p className="text-white/60">$ draft follow_up --day 3</p>
                <p className="text-white/40 mt-1">&gt; Template: FEVER_TRACKER_V2</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="terminal-blink w-1 h-3.5 bg-blue-400"></span>
                  <span className="text-white/30 text-[9px]">Awaiting record signing...</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onFinalize(selectedPatientId, primaryDiagnosis, { temp, bp, pulse, spo2 })}
            className="mt-4 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20"
          >
            <Sparkles className="w-4 h-4 text-white animate-spin-slow" /> Apply Intelligence to Record
          </button>
        </aside>
      </div>

      {/* Bottom Sticky Footer */}
      <footer className="fixed bottom-0 right-0 w-[calc(100%-260px)] bg-white/95 backdrop-blur-md border-t border-black/5 h-20 px-10 flex items-center justify-between z-40 shadow-[0_-8px_24px_rgba(0,0,0,0.02)] select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-text-secondary cursor-pointer" onClick={triggerSaveDraft}>
            <CloudLightning className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {isSyncing ? 'Autosaving...' : 'Autosave: Active (14:42)'}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-1.5 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Compliance Verified</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={triggerSaveDraft}
            className="px-6 h-11 rounded-xl border-2 border-slate-100 text-text-secondary font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            Save Draft
          </button>
          <button 
            onClick={() => onFinalize(selectedPatientId, primaryDiagnosis, { temp, bp, pulse, spo2 })}
            className="px-8 h-11 rounded-xl bg-gradient-to-r from-primary to-blue-700 text-white font-bold text-xs shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer uppercase tracking-wider animate-pulse-slow"
          >
            Finalize for Review
          </button>
        </div>
      </footer>
    </div>
  );
}
