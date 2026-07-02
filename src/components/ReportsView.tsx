import React from 'react';
import { 
  FileText, 
  TrendingUp, 
  CheckSquare, 
  ShieldAlert, 
  CheckCircle2, 
  FileDown, 
  BarChart3 
} from 'lucide-react';

interface ReportsViewProps {
  searchValue: string;
}

export default function ReportsView({ searchValue }: ReportsViewProps) {
  const complianceItems = [
    { title: 'Electronic Case-Signature Verification', status: 'Compliant', desc: 'All diagnostic files are signed off with cryptographic keys.' },
    { title: 'Pathology Sample Matching Protocol', status: 'Compliant', desc: 'Matched patient identification bar code logs with blood tests.' },
    { title: 'Contraindicated Drug-Interaction Monitoring', status: 'Requires Review', desc: 'Found 1 instance where NSAIDs and adverse records crossed paths.' },
    { title: 'Prenatal Screenings Interval Compliance', status: 'Compliant', desc: 'All high-risk mother registrations are successfully processed.' }
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Title */}
      <section className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
        <h3 className="font-card-title text-[18px] font-bold text-text-primary">
          Clinical Audit &amp; Performance Reports
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Comprehensive compliance telemetry, surgical efficacy indexes, and residency validation checklists.
        </p>
      </section>

      {/* Stats summary row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Overall Efficacy</p>
          <div className="text-3xl font-black text-primary mt-1">94.2%</div>
          <p className="text-[10px] text-success-green font-bold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2.1% from Q1
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Unresolved Flags</p>
          <div className="text-3xl font-black text-danger-red mt-1">1</div>
          <p className="text-[10px] text-text-secondary font-bold mt-1.5">
            1 interactive drug audit pending
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Total Diagnostic Audits</p>
          <div className="text-3xl font-black text-primary mt-1">1,240</div>
          <p className="text-[10px] text-success-green font-bold mt-1.5">
            All files logged and archived
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Regulatory Index</p>
          <div className="text-3xl font-black text-[#10b981] mt-1">A+</div>
          <p className="text-[10px] text-text-secondary font-bold mt-1.5">
            Teaching hospital validation pass
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Checklist Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-black/5">
            <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-primary" /> Regulatory Compliance Checklists
            </h4>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live Audit</span>
          </div>

          <div className="space-y-4">
            {complianceItems.map((item, idx) => {
              const isComp = item.status === 'Compliant';
              return (
                <div key={idx} className="p-4 bg-slate-50 border border-black/5 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-xs text-text-primary">{item.title}</h5>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      isComp ? 'bg-success-green/10 text-success-green' : 'bg-danger-red/10 text-danger-red animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Efficacy trends mock panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-black/5 mb-4">
              <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-primary" /> Core Outcome Analytics
              </h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Residency outcome records matched with AI prediction values suggest a +12% improvement in diagnostic speed across the primary intake.
            </p>
          </div>

          <div className="h-44 flex items-end justify-between px-6 gap-3 mt-6">
            <div className="w-full bg-slate-100 h-2/3 rounded-t-lg hover:bg-primary/20 transition-all cursor-pointer"></div>
            <div className="w-full bg-slate-100 h-4/5 rounded-t-lg hover:bg-primary/20 transition-all cursor-pointer"></div>
            <div className="w-full bg-slate-100 h-3/5 rounded-t-lg hover:bg-primary/20 transition-all cursor-pointer"></div>
            <div className="w-full bg-primary h-full rounded-t-lg"></div>
          </div>

          <div className="border-t border-black/5 pt-4 mt-6">
            <button className="text-primary font-bold text-xs hover:underline cursor-pointer flex items-center justify-center gap-1.5 w-full">
              <FileDown className="w-4 h-4" /> Download Complete Quality Audits (.pdf)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
