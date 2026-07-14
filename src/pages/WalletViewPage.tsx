import React, { useEffect, useState } from 'react';
import {
  getDatetime,
  getDecimal,
  getSolidDataset,
  getStringNoLocale,
  getThing,
} from '@inrupt/solid-client';
import { AlertCircle, CalendarDays, HeartPulse, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const CLINIX = 'https://clinix.ng/vocab#';
const SCHEMA = 'https://schema.org/';

interface RecordData {
  patientName: string;
  encounterId: string;
  chiefComplaint: string;
  diagnosis: string;
  aiDiagnosis: string;
  aiConfidence?: number;
  treatmentPlan: string;
  followUp: string;
  vitals: Record<string, unknown>;
  finalizedAt?: Date;
}

function joinPodPath(podUrl: string, path: string) {
  return `${podUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function WalletViewPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [record, setRecord] = useState<RecordData | null>(null);

  useEffect(() => {
    const loadRecord = async () => {
      const pod = searchParams.get('pod');
      const enc = searchParams.get('enc');
      if (!pod || !enc) {
        setError('This wallet link is missing required record details.');
        setLoading(false);
        return;
      }

      const fetchFromPod = async (podUrl: string) => {
        const datasetUrl = joinPodPath(podUrl, `clinix/encounters/${enc}`);
        const dataset = await getSolidDataset(datasetUrl);
        const thing = getThing(dataset, `${datasetUrl}#encounter`);
        if (!thing) {
          throw new Error('The health record was not found in this POD.');
        }
        return thing;
      };

      try {
        let thing;
        try {
          thing = await fetchFromPod(pod);
        } catch (firstErr) {
          // Pod data may have been wiped after a redeploy — attempt recovery
          setError('');
          setLoading(true);
          const apiBase =
            (import.meta as Record<string, Record<string, string>>).env
              ?.VITE_API_BASE_URL || '/api/v1';
          const recoverRes = await fetch(
            `${apiBase}/wallet/recover?enc=${encodeURIComponent(enc)}`,
            { method: 'POST' },
          );
          if (!recoverRes.ok) {
            throw firstErr; // recovery failed — show original error
          }
          const recoverData = await recoverRes.json();
          const freshPod = recoverData.solid_pod_url || pod;
          thing = await fetchFromPod(freshPod);
        }

        const vitalsText = getStringNoLocale(thing, `${CLINIX}vitals`) || '{}';
        let vitals = {};
        try {
          vitals = JSON.parse(vitalsText);
        } catch {
          vitals = {};
        }

        setRecord({
          patientName: getStringNoLocale(thing, `${SCHEMA}patient`) || 'Patient',
          encounterId: getStringNoLocale(thing, `${CLINIX}encounter_id`) || enc,
          chiefComplaint: getStringNoLocale(thing, `${CLINIX}chief_complaint`) || 'Not recorded',
          diagnosis: getStringNoLocale(thing, `${CLINIX}diagnosis`) || 'Not recorded',
          aiDiagnosis: getStringNoLocale(thing, `${CLINIX}ai_diagnosis`) || 'Not recorded',
          aiConfidence: getDecimal(thing, `${CLINIX}ai_confidence`) || undefined,
          treatmentPlan: getStringNoLocale(thing, `${CLINIX}treatment_plan`) || 'Not recorded',
          followUp: getStringNoLocale(thing, `${CLINIX}follow_up`) || 'Not recorded',
          vitals,
          finalizedAt: getDatetime(thing, `${CLINIX}finalized_at`) || undefined,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'We could not reach this Solid POD right now.');
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 font-sans text-[#0f172a]">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo.png" alt="Clinix" className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="text-xl font-extrabold text-[#0d9488]">Clinix</h1>
            <p className="text-xs font-semibold text-[#64748b]">Patient Health Record</p>
          </div>
        </div>

        {loading && (
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-5">
              <Loader2 className="h-5 w-5 animate-spin text-[#0d9488]" />
              <p className="text-sm font-bold">Loading your record</p>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-2/3 rounded bg-slate-100" />
              <div className="h-20 rounded bg-slate-100" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 rounded bg-slate-100" />
                <div className="h-16 rounded bg-slate-100" />
              </div>
            </div>
          </section>
        )}

        {!loading && error && (
          <section className="rounded-2xl bg-white p-5 shadow-sm border border-[#e2e8f0]">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-base font-extrabold">Record unavailable</h2>
                <p className="mt-1 text-sm leading-6 text-[#64748b]">{error}</p>
              </div>
            </div>
          </section>
        )}

        {!loading && !error && record && (
          <section className="rounded-2xl bg-white shadow-sm border border-[#e2e8f0] overflow-hidden">
            <div className="bg-[#0d9488] px-5 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-white/75">Encounter Record</p>
              <h2 className="mt-1 text-2xl font-extrabold">{record.patientName}</h2>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                <CalendarDays className="h-4 w-4" />
                <span>{record.finalizedAt ? record.finalizedAt.toLocaleDateString() : 'Date not recorded'}</span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Chief Complaint</p>
                <p className="mt-1 text-sm font-semibold">{record.chiefComplaint}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Diagnosis</p>
                  <p className="mt-1 text-sm font-extrabold text-[#0d9488]">{record.diagnosis}</p>
                </div>
                <div className="rounded-xl bg-[#f8fafc] p-4 border border-[#e2e8f0]">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">AI Diagnosis</p>
                  <p className="mt-1 text-sm font-extrabold">{record.aiDiagnosis}</p>
                  {typeof record.aiConfidence === 'number' && (
                    <p className="mt-1 text-xs text-[#64748b]">{Math.round(record.aiConfidence * 100)}% confidence</p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-[#0d9488]" />
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Vitals</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(record.vitals).map(([key, value]) => (
                    <div key={key} className="rounded-xl bg-[#f8fafc] p-3 border border-[#e2e8f0]">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">{formatLabel(key)}</p>
                      <p className="mt-1 text-sm font-extrabold">{String(value)}</p>
                    </div>
                  ))}
                  {Object.keys(record.vitals).length === 0 && (
                    <div className="col-span-2 rounded-xl bg-[#f8fafc] p-3 border border-[#e2e8f0] text-sm text-[#64748b]">
                      No vitals were recorded.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Treatment Plan</p>
                <p className="mt-1 text-sm leading-6">{record.treatmentPlan}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748b]">Follow-up Instructions</p>
                <p className="mt-1 text-sm leading-6">{record.followUp}</p>
              </div>
            </div>

            <footer className="border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-4 text-xs leading-5 text-[#64748b]">
              This record is stored in your personal Solid POD and owned by you.
            </footer>
          </section>
        )}
      </div>
    </main>
  );
}
