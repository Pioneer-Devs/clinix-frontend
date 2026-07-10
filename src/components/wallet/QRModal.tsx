import React, { useEffect, useState } from 'react';
import { Check, Copy, Loader2, ShieldCheck, X } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const pushToSolid = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('clinix_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const pushRes = await fetch(`${API_BASE}/wallets/${patientId}/push-to-pod`, {
        method: 'POST',
        headers,
      });

      if (!pushRes.ok) {
        const err = await pushRes.json().catch(() => ({})) as { detail?: string };
        throw new Error(err.detail || `Push failed (${pushRes.status})`);
      }

      const pushData = await pushRes.json() as { qr_url: string };
      setQrLink(pushData.qr_url);

      // Fetch patient name + diagnosis for the info card
      const walletRes = await fetch(`${API_BASE}/wallets/${patientId}`, { headers });
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setPatientName(walletData.encounter?.patient_name || '');
        setDiagnosis(walletData.encounter?.diagnosis || '');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not push this encounter to the Solid POD.',
      );
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <button
        aria-label="Close wallet modal background"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet — slides up from bottom on mobile, centered card on sm+ */}
      <div className="
        relative z-10 w-full bg-white shadow-2xl border-t border-border
        rounded-t-3xl px-5 pt-5 pb-8
        sm:rounded-2xl sm:border sm:max-w-md sm:px-6 sm:py-6 sm:pb-6
      ">
        {/* Drag handle — visible on mobile only */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg text-text-secondary hover:bg-bg-main transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <img src="/logo.png" alt="Clinix" className="h-8 w-8 rounded-lg" />
          <div>
            <p className="text-sm font-extrabold text-primary">Clinix</p>
            <p className="text-[11px] text-text-secondary font-semibold">Solid POD health record</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold text-text-primary">Publishing encounter to patient POD</p>
            <p className="text-xs text-text-secondary mt-1">Creating the portable health record now.</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700">Solid push unavailable</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={pushToSolid}
              className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success */}
        {!loading && !error && qrLink && (
          <div className="space-y-4">
            {/* Patient info card */}
            <div className="rounded-xl border border-border bg-bg-main p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-light font-bold mb-1">Patient</p>
                  <p className="text-sm font-bold text-text-primary truncate">{patientName}</p>
                  {diagnosis && (
                    <p className="text-xs text-primary font-semibold mt-0.5 truncate">{diagnosis}</p>
                  )}
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 rounded-full bg-green-50 border border-green-100 px-2.5 py-1">
                  <ShieldCheck className="h-3 w-3 text-green-600" />
                  <span className="text-[10px] font-bold text-green-700">Verified</span>
                </div>
              </div>
            </div>

            {/* QR code — smaller on mobile */}
            <div className="flex flex-col items-center">
              <div className="inline-flex rounded-2xl border border-border bg-white p-3 sm:p-4 shadow-sm">
                <QRCodeSVG
                  value={qrLink}
                  size={typeof window !== 'undefined' && window.innerWidth < 400 ? 150 : 180}
                  level="H"
                  fgColor="#0f172a"
                />
              </div>
              <p className="mt-3 text-[11px] text-text-secondary font-medium text-center">
                Scan to access portable health record
              </p>
            </div>

            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Link Copied!' : 'Copy Shareable Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
