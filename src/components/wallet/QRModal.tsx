import React, { useEffect, useState } from 'react';
import {
  addDatetime,
  addDecimal,
  addStringNoLocale,
  buildThing,
  createSolidDataset,
  createThing,
  saveSolidDatasetAt,
  setThing,
} from '@inrupt/solid-client';
import { Session } from '@inrupt/solid-client-authn-browser';
import { Check, Copy, Loader2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRModalProps {
  patientId: string;
  onClose: () => void;
}

interface WalletEncounter {
  encounter_id: string;
  patient_id: string;
  patient_name: string;
  solid_pod_url: string;
  solid_web_id: string;
  solid_token_id: string;
  solid_token_secret: string;
  chief_complaint: string;
  diagnosis?: string;
  ai_diagnosis?: string;
  ai_confidence?: number;
  treatment_plan?: string;
  follow_up?: string;
  vitals?: Record<string, unknown>;
  finalized_at?: string;
}

interface WalletResponse {
  encounter: WalletEncounter;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const SOLID_SERVER_URL = import.meta.env.VITE_SOLID_SERVER_URL || '';
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
const CLINIX = 'https://clinix.ng/vocab#';
const SCHEMA = 'https://schema.org/';

function joinPodPath(podUrl: string, path: string) {
  return `${podUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function isAllowedSolidOrigin(url: string) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function QRModal({ patientId, onClose }: QRModalProps) {
  const [loading, setLoading] = useState(true);
  const [pushing, setPushing] = useState(false);
  const [error, setError] = useState('');
  const [qrLink, setQrLink] = useState('');
  const [podUrl, setPodUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [encounter, setEncounter] = useState<WalletEncounter | null>(null);

  const pushToSolid = async () => {
    setError('');
    setPushing(true);

    try {
      if (!isAllowedSolidOrigin(SOLID_SERVER_URL)) {
        throw new Error('Solid push is disabled until VITE_SOLID_SERVER_URL points to localhost or the same trusted origin.');
      }

      const walletResponse = await fetch(`${API_BASE}/wallets/${patientId}`);
      if (!walletResponse.ok) {
        throw new Error('Unable to load the finalized wallet record.');
      }

      const walletData = (await walletResponse.json()) as WalletResponse;
      const record = walletData.encounter;
      setEncounter(record);
      setPodUrl(record.solid_pod_url);

      const session = new Session();
      await session.login({
        oidcIssuer: SOLID_SERVER_URL,
        clientId: record.solid_token_id,
        clientSecret: record.solid_token_secret,
        tokenType: 'DPoP',
      });

      const datasetUrl = joinPodPath(record.solid_pod_url, `clinix/encounters/${record.encounter_id}`);
      const thingUrl = `${datasetUrl}#encounter`;
      let thing = createThing({ url: thingUrl });

      thing = buildThing(thing)
        .addStringNoLocale(`${SCHEMA}identifier`, record.encounter_id)
        .addStringNoLocale(`${SCHEMA}patient`, record.patient_name || '')
        .addStringNoLocale(`${CLINIX}encounter_id`, record.encounter_id)
        .addStringNoLocale(`${CLINIX}chief_complaint`, record.chief_complaint || '')
        .addStringNoLocale(`${CLINIX}diagnosis`, record.diagnosis || '')
        .addStringNoLocale(`${CLINIX}ai_diagnosis`, record.ai_diagnosis || '')
        .addStringNoLocale(`${CLINIX}treatment_plan`, record.treatment_plan || '')
        .addStringNoLocale(`${CLINIX}follow_up`, record.follow_up || '')
        .addStringNoLocale(`${CLINIX}vitals`, JSON.stringify(record.vitals || {}))
        .build();

      if (typeof record.ai_confidence === 'number') {
        thing = addDecimal(thing, `${CLINIX}ai_confidence`, record.ai_confidence);
      }
      if (record.finalized_at) {
        thing = addDatetime(thing, `${CLINIX}finalized_at`, new Date(record.finalized_at));
        thing = addDatetime(thing, `${SCHEMA}dateCreated`, new Date(record.finalized_at));
      }
      thing = addStringNoLocale(thing, `${CLINIX}solid_web_id`, record.solid_web_id);

      const dataset = setThing(createSolidDataset(), thing);
      await saveSolidDatasetAt(datasetUrl, dataset, { fetch: session.fetch });

      const confirmResponse = await fetch(`${API_BASE}/wallets/${patientId}/confirm-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solid_pod_url: record.solid_pod_url }),
      });
      if (!confirmResponse.ok) {
        throw new Error('The encounter was saved, but Clinix could not confirm the push.');
      }

      const nextQrLink = `${APP_URL.replace(/\/$/, '')}/wallet/view?pod=${encodeURIComponent(record.solid_pod_url)}&enc=${encodeURIComponent(record.encounter_id)}`;
      setQrLink(nextQrLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not push this encounter to the Solid POD.');
    } finally {
      setLoading(false);
      setPushing(false);
    }
  };

  useEffect(() => {
    pushToSolid();
  }, [patientId]);

  const handleCopy = async () => {
    if (!qrLink) return;
    await navigator.clipboard.writeText(qrLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="Close wallet modal background" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-lg text-text-secondary hover:bg-bg-main">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <img src="/logo.png" alt="Clinix" className="h-8 w-8 rounded-lg" />
          <div>
            <p className="text-sm font-extrabold text-primary">Clinix</p>
            <p className="text-[11px] text-text-secondary font-semibold">Solid POD health record</p>
          </div>
        </div>

        {(loading || pushing) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold text-text-primary">Publishing encounter to patient POD</p>
            <p className="text-xs text-text-secondary mt-1">Creating the portable health record now.</p>
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700">Solid push unavailable</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button onClick={pushToSolid} className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && qrLink && (
          <div className="text-center">
            <div className="mb-4 rounded-xl bg-bg-main border border-border p-4 text-left">
              <p className="text-[10px] uppercase tracking-wide text-text-light font-bold">Patient</p>
              <p className="text-sm font-bold text-text-primary">{encounter?.patient_name}</p>
              <p className="text-xs text-primary font-semibold mt-1">{encounter?.diagnosis || 'Finalized encounter'}</p>
            </div>

            <div className="mx-auto mb-4 inline-flex rounded-2xl border border-border bg-white p-4">
              <QRCodeSVG value={qrLink} size={176} level="H" fgColor="#0f172a" />
            </div>

            <button onClick={handleCopy} className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark flex items-center justify-center gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>

            <p className="mt-4 break-all rounded-xl bg-bg-main p-3 text-[10px] text-text-secondary font-mono">{podUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}
