import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, ArrowLeft, Brain, CheckCircle2, CloudLightning, Sparkles, X, Zap } from 'lucide-react';
import { analyzeEncounter, createEncounter, finalizeEncounter, updateEncounter } from '../lib/api';
import { AIAnalysis, Patient } from '../types';

interface NewEncounterProps {
  token: string;
  patients: Patient[];
  selectedPatientId: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onPatientSelect: (id: string) => void;
  onBack: () => void;
  onFinalized: (patientId: string, encounterId: string) => void;
}

function toSeverity(value: string) {
  if (value === 'Emergency') return 'life_threatening';
  return value.toLowerCase();
}

export default function NewEncounterView({
  token,
  patients,
  selectedPatientId,
  loading,
  error,
  onRetry,
  onPatientSelect,
  onBack,
  onFinalized,
}: NewEncounterProps) {
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const isReadOnly = ['finalized', 'pending_review', 'approved'].includes(patient?.latestEncounterStatus || '');
  const [encounterId, setEncounterId] = useState('');
  const [temp, setTemp] = useState(0);
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Emergency'>('Moderate');
  const [physicalExam, setPhysicalExam] = useState('');
  const [workingDiagnosis, setWorkingDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [statusText, setStatusText] = useState('Ready');
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [ai, setAi] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    if (!patient) return;
    setTemp(patient.vitals.temp);
    setBp(patient.vitals.bp);
    setPulse(patient.vitals.pulse);
    setSpo2(patient.vitals.spo2);
    setChiefComplaint(patient.chiefComplaint === 'No active complaint recorded' ? '' : patient.chiefComplaint);
    setWorkingDiagnosis(patient.workingDiagnosis || '');
    setEncounterId(patient.latestEncounterId || '');
    setSymptoms(patient.associatedSymptoms || []);
    setPhysicalExam(patient.examNotes || '');
    setTreatmentPlan(patient.treatmentPlan || '');
    setAi(patient.aiAnalysis || null);
  }, [patient]);

  if (loading) {
    return <div className="h-[480px] rounded-2xl bg-white border border-border animate-pulse" />;
  }

  if (error || !patient) {
    return (
      <div className="card-base p-8 text-center">
        <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
        <p className="text-sm font-bold text-text-primary">Encounter workspace unavailable</p>
        <p className="text-xs text-text-secondary mt-1">{error || 'No patient is available to start an encounter.'}</p>
        <button onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">Retry</button>
      </div>
    );
  }

  const handleAddSymptom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSymptomText.trim()) {
      e.preventDefault();
      setSymptoms([...symptoms, newSymptomText.trim()]);
      setNewSymptomText('');
    }
  };

  const ensureEncounter = async () => {
    if (encounterId) return encounterId;
    const created = await createEncounter(token, {
      patient_id: patient.id,
      chief_complaint: chiefComplaint,
      severity: toSeverity(severity),
      associated_symptoms: symptoms,
      consent_obtained: true,
    });
    setEncounterId(created.id);
    return created.id;
  };

  const encounterUpdatePayload = () => ({
    vitals: { temperature: temp, blood_pressure: bp, pulse, spo2 },
    exam_notes: physicalExam,
    working_diagnosis: workingDiagnosis,
    treatment_plan: treatmentPlan,
    severity: toSeverity(severity),
    associated_symptoms: symptoms,
  });

  const saveDraft = async (existingEncounterId?: string) => {
    setSaving(true);
    setPageError('');
    try {
      const id = existingEncounterId || await ensureEncounter();
      await updateEncounter(token, id, encounterUpdatePayload());
      setStatusText('Saved');
      return id;
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Unable to save encounter.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const runAi = async () => {
    setAiLoading(true);
    setPageError('');
    try {
      const id = await ensureEncounter();
      await saveDraft(id);
      const response = await analyzeEncounter(token, id);
      const analysis = response.analysis as AIAnalysis;
      setAi(analysis);
      if (analysis?.primaryDiagnosis) setWorkingDiagnosis(analysis.primaryDiagnosis);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'AI analysis failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleFinalize = async () => {
    setSaving(true);
    setPageError('');
    try {
      const id = await ensureEncounter();
      await updateEncounter(token, id, encounterUpdatePayload());
      const finalized = await finalizeEncounter(token, id);
      onFinalized(patient.id, finalized.id);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Unable to finalize encounter.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5">
      {pageError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700 font-semibold">{pageError}</div>
      )}

      {isReadOnly && (
        <div className="rounded-xl border border-border bg-bg-main px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-xs font-bold text-text-primary">
              {patient.latestEncounterStatus === 'approved' ? 'Encounter approved — record is read-only' :
               patient.latestEncounterStatus === 'pending_review' ? 'Submitted for review — record is read-only' :
               'Encounter finalized — record is read-only'}
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            patient.latestEncounterStatus === 'approved' ? 'bg-success/10 text-success' :
            'bg-warning/10 text-warning'
          }`}>
            {patient.latestEncounterStatus?.replace('_', ' ')}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 pb-20">
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-lg border border-border shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm text-white ${patient.priority === 'urgent' ? 'bg-accent' : 'bg-primary'}`}>
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div>
                <h3 className="font-bold text-[13px] text-text-primary">{patient.firstName} {patient.lastName}</h3>
                <p className="text-[10px] text-text-secondary font-semibold mt-0.5 uppercase tracking-wider">{patient.hospitalId} - {patient.gender}, {patient.age}y</p>
              </div>
            </div>
            <select value={selectedPatientId} onChange={(e) => onPatientSelect(e.target.value)} className="border border-border bg-bg-main rounded text-[11px] font-bold px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer shadow-sm text-text-primary">
              {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.hospitalId})</option>)}
            </select>
          </div>

          <div className="card-base overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <h4 className="text-xs font-bold text-text-primary">Vitals & Presentation</h4>
            </div>
            <div className="p-5 border-b border-border-light">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Temp (°C)</label>
                  <input aria-label="Temperature" type="number" step="0.1" value={temp || ''} onChange={e => setTemp(parseFloat(e.target.value) || 0)} placeholder="36.5" disabled={isReadOnly} className="w-full border border-border rounded-xl px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none transition-colors disabled:bg-bg-main disabled:text-text-secondary disabled:cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">BP (mmHg)</label>
                  <input aria-label="Blood pressure" type="text" value={bp} onChange={e => setBp(e.target.value)} placeholder="120/80" disabled={isReadOnly} className="w-full border border-border rounded-xl px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none transition-colors disabled:bg-bg-main disabled:text-text-secondary disabled:cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Pulse (bpm)</label>
                  <input aria-label="Pulse" type="number" value={pulse || ''} onChange={e => setPulse(parseInt(e.target.value) || 0)} placeholder="72" disabled={isReadOnly} className="w-full border border-border rounded-xl px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none transition-colors disabled:bg-bg-main disabled:text-text-secondary disabled:cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">SpO2 (%)</label>
                  <input aria-label="Oxygen saturation" type="number" value={spo2 || ''} onChange={e => setSpo2(parseInt(e.target.value) || 0)} placeholder="98" disabled={isReadOnly} className="w-full border border-border rounded-xl px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none transition-colors disabled:bg-bg-main disabled:text-text-secondary disabled:cursor-not-allowed" />
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <textarea value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)} rows={2} placeholder="Chief complaint" readOnly={isReadOnly} className={`w-full border border-border rounded-xl px-4 py-2.5 text-xs resize-none ${isReadOnly ? 'bg-bg-main text-text-secondary cursor-not-allowed' : ''}`} />
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {symptoms.map((s) => (
                    <span key={s} className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-semibold">
                      {s}
                      {!isReadOnly && <button onClick={() => setSymptoms(symptoms.filter((item) => item !== s))}><X className="w-3 h-3" /></button>}
                    </span>
                  ))}
                </div>
                {!isReadOnly && (
                  <input type="text" value={newSymptomText} onChange={e => setNewSymptomText(e.target.value)} onKeyDown={handleAddSymptom} placeholder="Type symptom and press Enter..." className="w-full border border-border rounded-xl px-4 py-2 text-[11px]" />
                )}
              </div>
              <div className="flex gap-2">
                {(['Mild', 'Moderate', 'Severe', 'Emergency'] as const).map(sev => (
                  <button key={sev} onClick={() => !isReadOnly && setSeverity(sev)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border ${severity === sev ? 'gradient-primary text-white border-primary' : 'bg-white text-text-secondary border-border'} ${isReadOnly ? 'cursor-not-allowed opacity-70' : ''}`}>{sev}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-bg-main">
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-[11px] font-bold text-text-primary uppercase tracking-wide">AI Diagnosis Engine</h4>
              </div>
              {!isReadOnly && (
                <button onClick={runAi} disabled={aiLoading || !chiefComplaint} className="flex items-center gap-1.5 px-3 py-1 rounded border border-primary/20 bg-primary/5 text-[9px] font-bold text-primary uppercase disabled:opacity-50">
                  <Zap className="w-2.5 h-2.5" /> {aiLoading ? 'Analyzing' : 'Run AI'}
                </button>
              )}
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {aiLoading && <p className="text-xs text-text-secondary font-semibold">Analyzing encounter...</p>}
              {ai ? (
                <>
                  <div className="bg-bg-main border border-border p-3.5 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-text-secondary uppercase">Primary Diagnosis</span>
                      <span className="text-[11px] font-extrabold text-success">{Math.round(ai.confidence * 100)}%</span>
                    </div>
                    <p className="text-sm font-bold text-text-primary">{ai.primaryDiagnosis}</p>
                    {ai.urgency && (
                      <div className="mt-2 text-[10px] font-bold px-2 py-1 rounded inline-block bg-accent/10 text-accent uppercase tracking-wider">
                        Urgency: {ai.urgency}
                      </div>
                    )}
                  </div>
                  
                  {ai.differential && ai.differential.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-1">Differential</h5>
                      {ai.differential.map((d) => (
                        <p key={d.condition} className="text-[10px] text-text-secondary flex justify-between">
                          <span>{d.condition}</span>
                          <span className="font-semibold">{Math.round(d.probability * 100)}%</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {ai.recommendedInvestigations && ai.recommendedInvestigations.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-1">Investigations</h5>
                      <ul className="list-disc pl-4 text-[10px] text-text-secondary space-y-0.5">
                        {ai.recommendedInvestigations.map((inv, idx) => (
                          <li key={idx}>{inv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ai.mcpActions && ai.mcpActions.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-bold text-text-secondary uppercase mb-1">Automated Actions</h5>
                      <div className="space-y-1.5">
                        {ai.mcpActions.map((mcp, idx) => (
                          <div key={idx} className="bg-primary/5 border border-primary/10 p-2 rounded-md">
                            <p className="text-[9px] font-bold text-primary mb-1 uppercase tracking-wider">{mcp.skill}</p>
                            {mcp.actions?.map((act, i) => (
                              <p key={i} className="text-[10px] text-text-secondary">
                                • {act.type}: {act.drug || act.test || 'Action Executed'} 
                                {act.stock !== undefined && ` (Stock: ${act.stock})`}
                                {act.available !== undefined && ` (${act.available ? 'Available' : 'Unavailable'})`}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-text-secondary">Save the presentation and run AI to retrieve backend analysis.</p>
              )}
            </div>
          </div>

          <div className="card-base overflow-hidden flex-1">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <h4 className="text-xs font-bold text-text-primary">Assessment & Orders</h4>
            </div>
            <div className="p-5 space-y-4">
              <textarea value={physicalExam} onChange={e => setPhysicalExam(e.target.value)} rows={3} placeholder="Physical examination" readOnly={isReadOnly} className={`w-full border border-border rounded-xl px-4 py-2.5 text-[11px] resize-none ${isReadOnly ? 'bg-bg-main text-text-secondary cursor-not-allowed' : ''}`} />
              <textarea value={workingDiagnosis} onChange={e => setWorkingDiagnosis(e.target.value)} rows={3} placeholder="Working diagnosis" readOnly={isReadOnly} className={`w-full border border-border rounded-xl px-4 py-2.5 text-[11px] font-semibold resize-none ${isReadOnly ? 'bg-bg-main text-text-secondary cursor-not-allowed' : ''}`} />
              <textarea value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} rows={3} placeholder="Treatment plan" readOnly={isReadOnly} className={`w-full border border-border rounded-xl px-4 py-2.5 text-[11px] resize-none ${isReadOnly ? 'bg-bg-main text-text-secondary cursor-not-allowed' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-56 bg-white/80 backdrop-blur-xl border-t border-border px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4 text-[10px] text-text-secondary font-semibold">
          <span className="flex items-center gap-1.5">
            <CloudLightning className={`w-3.5 h-3.5 ${saving ? 'text-warning' : 'text-success'}`} />
            {saving ? 'Syncing...' : isReadOnly ? 'Read Only' : statusText}
          </span>
          {ai && <span className="flex items-center gap-1.5 text-primary"><Brain className="w-3.5 h-3.5" /> AI Complete</span>}
        </div>
        {isReadOnly ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span className="text-[11px] font-bold text-success capitalize">
              {patient.latestEncounterStatus?.replace('_', ' ')}
            </span>
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => saveDraft()} disabled={saving || !chiefComplaint} className="px-5 py-2 text-[11px] font-bold text-text-secondary bg-white border border-border rounded-xl hover:bg-bg-main disabled:opacity-50">Save Draft</button>
            <button onClick={handleFinalize} disabled={saving || !workingDiagnosis || !treatmentPlan} className="px-6 py-2 text-[11px] font-bold text-white gradient-primary rounded-xl disabled:opacity-50">
              Finalize for Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
