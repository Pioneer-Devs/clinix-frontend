import React, { useEffect, useState } from 'react';
import { Check, Copy, Loader2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRModalProps {
  patientId: string;
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export default function QRModal({ patientId, onClose }: QRModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrLink, setQrLink] = useState('');
  const [patientName, setPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [podUrl, setPodUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const pushToSolid = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('clinix_token');
      const response = await fetch(`${API_BASE}/wallets/${patientId}/push-to-pod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Push failed (${response.status})`);
      }

      const data = await response.json();
      setQrLink(data.qr_url);
      setPodUrl(data.solid_pod_url);

      // Also fetch patient name + diagnosis for display
      const walletRes = await fetch(`${API_BASE}/wallets/${patientId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setPatientName(walletData.encounter?.patient_name || '');
        setDiagnosis(walletData.encounter?.diagnosis || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not push this encounter to the Solid POD.');
    } finally {
      setLoading(false);
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

        {loading && (
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
              <p className="text-sm font-bold text-text-primary">{patientName}</p>
              <p className="text-xs text-primary font-semibold mt-1">{diagnosis || 'Finalized encounter'}</p>
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
