import React from 'react';
import { 
  Beaker, 
  FlaskConical, 
  Clock, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  Download, 
  ShieldCheck 
} from 'lucide-react';

interface InvestigationsViewProps {
  searchValue: string;
}

export default function InvestigationsView({ searchValue }: InvestigationsViewProps) {
  const labInvestigations = [
    { id: 'LAB-9021', test: 'RDT for Malaria', patient: 'Fatima Abdullahi', status: 'Completed', result: 'Positive (Plasmodium falciparum)', date: 'Today, 14:10', validator: 'Dr. Ibrahim (Pathology)' },
    { id: 'LAB-9022', test: 'Full Blood Count (FBC)', patient: 'Fatima Abdullahi', status: 'Processing', result: 'Pending cell count metrics', date: 'Today, 13:45', validator: 'System Auto-analysis' },
    { id: 'LAB-8910', test: 'Urinalysis Multi-parameter', patient: 'James Okafor', status: 'Completed', result: 'Normal parameters, no leukocyte esterase', date: 'Yesterday, 10:20', validator: 'Dr. Sarah Chen' },
    { id: 'LAB-8842', test: 'Liver Function Test (LFT)', patient: 'Sarah Chen (Review Portal)', status: 'Awaiting Sample', result: 'Awaiting phlebotomy collection', date: 'Today, 09:00', validator: 'Central Lab Ward 1' }
  ];

  const filtered = labInvestigations.filter(item => 
    item.test.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.patient.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.result.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      {/* Title section */}
      <section className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
        <h3 className="font-card-title text-[18px] font-bold text-text-primary">
          Laboratory &amp; Investigations Hub
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Real-time diagnostics tracking, specimen logging, and electronic test validations.
        </p>
      </section>

      {/* Grid summarizing test state counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Completed Tests</span>
            <div className="text-2xl font-black text-primary mt-1">42</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success-green/10 flex items-center justify-center text-success-green">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Processing Specimen</span>
            <div className="text-2xl font-black text-warning-amber mt-1">8</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning-amber/10 flex items-center justify-center text-warning-amber">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Critical Anomalies</span>
            <div className="text-2xl font-black text-danger-red mt-1">1</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-danger-red/10 flex items-center justify-center text-danger-red">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Lab investigations table */}
      <section className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5">
          <h4 className="font-bold text-sm text-text-primary">Electronic Lab Order Registry</h4>
          <p className="text-[11px] text-text-secondary mt-0.5">Real-time validation log aligned with clinician credentials</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-black/5 text-[10px] uppercase font-bold text-text-secondary tracking-wider">
              <tr>
                <th className="px-6 py-4">Reference ID</th>
                <th className="px-6 py-4">Investigation Ordered</th>
                <th className="px-6 py-4">Patient Target</th>
                <th className="px-6 py-4">Lab Result Index</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-xs text-text-primary">
              {filtered.map((item, index) => {
                const isComp = item.status === 'Completed';
                const isProc = item.status === 'Processing';
                return (
                  <tr key={index} className="hover:bg-primary/5 transition-all">
                    <td className="px-6 py-4 font-bold font-mono text-primary">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {item.test}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {item.patient}
                    </td>
                    <td className="px-6 py-4 font-medium max-w-xs truncate">
                      {item.result}
                      <div className="text-[10px] text-text-secondary mt-0.5">Validated: {item.validator}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                        isComp 
                          ? 'bg-success-green/10 text-success-green' 
                          : isProc 
                            ? 'bg-warning-amber/10 text-warning-amber' 
                            : 'bg-slate-100 text-text-secondary'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-black/5 rounded-lg text-primary transition-colors cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
