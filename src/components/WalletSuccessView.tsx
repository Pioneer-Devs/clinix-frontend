import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Copy, 
  Clock, 
  HelpCircle,
  X,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface WalletSuccessProps {
  onClose: () => void;
  patientName?: string;
  diagnosis?: string;
}

export default function WalletSuccessView({ 
  onClose,
  patientName = "John Doe",
  diagnosis = "Malaria (Uncomplicated)"
}: WalletSuccessProps) {
  const [secondsLeft, setSecondsLeft] = useState(599); // 09:59
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Live ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) return 599; // cycle reset
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const padMin = min < 10 ? '0' + min : min;
    const padSec = sec < 10 ? '0' + sec : sec;
    return `${padMin}:${padSec}`;
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Blurred background image overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-slate-100 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ_yJsoEVqhuA4_wn7iyLWsFTTBnMH8NsPyCoKpTkyO8W6kzgHHb3iuzsy8FpDJ6l1MWM-DK6MMGDvrRHCFa4i7oEfLWdi5-dcHHXIVxybKm5W5RN3IaNXYrAj1p8V2QpPUpgNf5VrJwDHWbiylefMKD7ZPG0w7vY73tUzrvgPfIPlXY7I1zkSIvn9lfzrdqcKx1cdZF5V-S08ooqWkX0DjNFBfbVKYmIw193dA5s_Ndu76b3Z4HOZ1o5Qdo-0N1oiCK9NGyl5N9U" 
          alt="Clinical Grid Background" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-45 filter blur-xs" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 via-white/40 to-slate-200/50 mix-blend-multiply" />
      </div>

      {/* Main Success Dialog Canvas */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl p-6 md:p-10 flex flex-col items-center text-center overflow-hidden"
      >
        {/* Close Button top-right */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-black/5 hover:bg-black/10 rounded-full text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <span className="font-page-title text-[20px] font-black text-primary tracking-tight">
              Sovereign Clinical Agent
            </span>
          </div>
          <div className="h-0.5 w-12 bg-primary rounded-full opacity-20"></div>
        </div>

        {/* 3D Crystalline digital health wallet artwork */}
        <div className="relative w-40 h-40 mb-6 group">
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgfG2scA9KsAHkwD4C1Dc74kcYJiWIR9Nln7bZJe6vmKM4NzD5v_JPkCQfZF9WwA5-lQUQ1Sn7pDnQrvU6GgxdjtsJoUsG4hvQXo1-Y9EOPNhcQ1Oqe5CCUcrdmWEgJ2eA-c0K5sRSkryxnDJiA48r2CsNTVTlNb_3lKz9CnuRB-JW-h2dWtkMwTWdeKtQVTqOayuJSSZsISrf-JNWXwGIuaNTNWjS3w5DQWlnSTKlw3_ODuxKO0r6tcuM4TS380RTIyJtVXZQ8i4" 
              alt="Digital wallet simulation" 
              referrerPolicy="no-referrer"
              className="object-contain drop-shadow-xl w-32 h-32 transform group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>

        {/* Success Confirmation Title & Text */}
        <h1 className="text-[26px] font-extrabold text-text-primary tracking-tight leading-none mb-2">
          Wallet Provisioned
        </h1>
        <p className="text-xs text-text-secondary max-w-md leading-relaxed mb-6">
          Your secure clinical credential for <span className="font-bold text-text-primary">{patientName}</span> is compiled with diagnostic outcome <span className="font-semibold text-primary">{diagnosis}</span>. Scan the cryptographic token below to sync.
        </p>

        {/* Digital QR Access Token */}
        <div className="relative group cursor-pointer mb-6">
          <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-lg transition-all group-hover:bg-primary/10" />
          <div className="relative bg-white p-4 rounded-2xl border border-black/5 shadow-md flex items-center justify-center">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPdGo6EqLec_1EwshOTL8oLQg8dsPecyfroUJkLBpq2Nsx-Kvc7qo0yctqxBKyZ60ThYwp25PY3JirjCSLp5CqqzqZjUROm5OCM4ZuPt2Oc4Vxm_q6AMRPZIAOcsaJcO78m7qAMOsuo7WuCXVZVZGk-OraneDibmmy0hu6hy4vTajHYfyXGX83K9wPLyMlhIUuyhndt9xR0A9sfax39Xx53eECNTs4ytFPki6NccKns9HkYdEe6VCu9882PMw6z0G6i00fMhR0iJE" 
              alt="Diagnostic QR Lock Key" 
              referrerPolicy="no-referrer"
              className="w-36 h-36 object-cover" 
            />
            <div className="absolute top-2 right-2 p-1 bg-slate-50 border border-black/5 rounded-lg text-primary shadow-sm">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Ticking key expiry counter */}
        <div className="flex items-center gap-1.5 mb-8 px-4 py-1.5 bg-slate-50 border border-black/5 rounded-full shadow-inner select-none">
          <Clock className="w-4 h-4 text-secondary ticking" />
          <span className="text-[10px] text-text-secondary uppercase font-black tracking-wider">Key expires in:</span>
          <span className="text-xs font-mono font-black text-secondary">{formatTime(secondsLeft)}</span>
        </div>

        {/* Trigger controls with feedback states */}
        <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button 
            onClick={handleDownload}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white hover:bg-primary-container rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 transition-all cursor-pointer uppercase tracking-wider"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {downloaded ? 'Receipt Saved' : 'Save PDF Receipt'}
          </button>
          
          <button 
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-3 bg-white text-primary border-2 border-primary/20 hover:border-primary/40 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Link Copied' : 'Copy Sync Link'}
          </button>
        </div>

        {/* Help footer */}
        <div className="mt-8 pt-5 border-t border-black/5 w-full">
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-primary font-body-semibold text-xs flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Didn't receive the credentials? </span>
            <span className="underline font-bold text-primary">Resend to Email</span>
          </button>
        </div>
      </motion.main>
    </div>
  );
}
