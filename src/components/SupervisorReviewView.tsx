import React, { useState } from 'react';
import { 
  History, 
  Sparkles, 
  User, 
  Check, 
  TrendingUp, 
  Timer, 
  Award, 
  AlertOctagon, 
  CheckCircle2, 
  Flag,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupervisorReviewProps {
  onBack: () => void;
  onApproveAndSign: (patientName: string, diagnosis: string) => void;
}

export default function SupervisorReviewView({
  onBack,
  onApproveAndSign
}: SupervisorReviewProps) {
  const [supervisorNotes, setSupervisorNotes] = useState('');
  const [adopted, setAdopted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Adopt AI suggestions action
  const handleAdoptSuggestions = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAdopted(true);
      setIsProcessing(false);
      setSupervisorNotes(prev => 
        (prev ? prev + '\n\n' : '') + 
        'Agree with Resident draft. Appending anti-emetic Zofran 4mg IV Q6H PRN per patient\'s nausea rating (4/10) and history of Ibuprofen sensitivity. Monitor urine output.'
      );
    }, 1200);
  };

  const handleSignEncounter = () => {
    onApproveAndSign('Patient #8842-X', 'Post-Op Laparoscopic Cholecystectomy');
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header Breadcrumbs and Banner */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-black/5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">
            <span className="hover:text-primary cursor-pointer" onClick={onBack}>Encounters</span>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer">Reviews</span>
            <span>/</span>
            <span className="text-primary">Post-Op Assessment</span>
          </nav>
          <h3 className="font-page-title text-[28px] font-bold text-text-primary tracking-tight">
            Case Review: Patient #8842-X
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Submitted by <span className="font-semibold text-text-primary">Junior Resident Sarah Chen</span> • 4 hours ago
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onBack}
            className="px-5 h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" /> Emergency
          </button>
          <button 
            onClick={handleSignEncounter}
            className="px-6 h-11 rounded-xl bg-success-green hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Check className="w-4 h-4" /> Approve &amp; Sign
          </button>
        </div>
      </section>

      {/* Bento Columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resident Draft Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <span className="bg-slate-100 text-text-secondary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Resident Draft
            </span>
            <History className="w-4.5 h-4.5 text-text-secondary" />
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary">Clinical Findings</h4>
            <div className="p-4 bg-slate-50 border border-black/5 rounded-2xl text-xs leading-relaxed text-text-primary font-medium">
              Patient presents post-laparoscopic cholecystectomy. Minimal drainage noted in JP bulb (serosanguinous). Vital signs stable within normal range. Mild tenderness at umbilical port site. Recommended discharge tomorrow morning.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary">Plan &amp; Action</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex gap-2.5 items-start text-text-primary font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <span>Continue current pain management regimen.</span>
              </li>
              <li className="flex gap-2.5 items-start text-text-primary font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <span>Advance diet as tolerated.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Suggestions Column (Dark Panel) */}
        <div className="lg:col-span-4 ai-glow-card rounded-3xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden text-white">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="bg-primary/20 text-blue-200 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-primary/30">
                AI Analysis
              </span>
              <Sparkles className="w-4.5 h-4.5 text-blue-300 animate-pulse" />
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-200">Enhanced Insights</h4>
              <div className="p-4 bg-white/5 border border-primary/20 rounded-2xl text-xs leading-relaxed text-blue-100/90 font-medium">
                Warning: Historical data for Patient #8842-X indicates a previous adverse reaction to Ibuprofen. <span className="text-blue-300 font-extrabold">Resident plan lacks specific anti-emetic orders</span> which are critical given the patient's nausea score (4/10).
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider leading-none">Suggested Revision</p>
                <p className="text-xs text-white font-bold mt-1">Add Zofran 4mg IV Q6H PRN</p>
              </div>
            </div>

            <button 
              onClick={handleAdoptSuggestions}
              disabled={adopted || isProcessing}
              className={`w-full py-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer uppercase tracking-wider ${
                adopted 
                  ? 'bg-success-green border-success-green text-white cursor-default' 
                  : 'bg-primary border-primary/40 hover:bg-primary-container text-white'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : adopted ? (
                <span className="flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Suggestions Adopted
                </span>
              ) : (
                'Adopt Suggestions'
              )}
            </button>
          </div>
        </div>

        {/* Supervisor Input Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-primary/30 shadow-lg shadow-primary/5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Supervisor View
            </span>
            <User className="w-4.5 h-4.5 text-primary" />
          </div>

          <div className="flex-1">
            <textarea 
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              rows={8}
              className="w-full h-full p-4 bg-slate-50/50 border border-black/5 focus:ring-4 focus:ring-primary/10 focus:border-primary/40 rounded-2xl text-xs font-medium text-text-primary placeholder:text-text-secondary/50 resize-none outline-none transition-all"
              placeholder="Enter your final clinical notes here..."
            />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 border border-primary text-primary hover:bg-primary/5 font-bold rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider">
              Flag for Review
            </button>
            <button 
              onClick={handleSignEncounter}
              className="flex-1 py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider"
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Student Trend Section & Competency Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-black/5">
            <div>
              <h4 className="font-bold text-sm text-text-primary">Student Performance Trend</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">Trailing 6 months • Surgical Proficiency</p>
            </div>
            
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Accuracy</p>
                <p className="text-lg font-bold text-primary">+12.4%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Efficiency</p>
                <p className="text-lg font-bold text-[#10b981]">98.2</p>
              </div>
            </div>
          </div>

          {/* Sophisticated Bar Chart Mockup with Hover Effects */}
          <div className="h-60 w-full flex items-end justify-between px-4 gap-4 relative select-none">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 h-full border-b border-black/5 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-black/5 w-full"></div>
              <div className="border-b border-black/5 w-full"></div>
              <div className="border-b border-black/5 w-full"></div>
              <div className="border-b border-black/5 w-full"></div>
            </div>

            {/* Bars */}
            {[
              { month: 'JAN', val: 'h-20', active: false },
              { month: 'FEB', val: 'h-28', active: false },
              { month: 'MAR', val: 'h-24', active: false },
              { month: 'APR', val: 'h-36', active: true, overlay: true, overlayPos: 'bottom-36' },
              { month: 'MAY', val: 'h-44', active: true, overlay: true, overlayPos: 'bottom-44' },
              { month: 'JUN', val: 'h-52', active: true, overlay: true, overlayPos: 'bottom-52' }
            ].map((bar, index) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 w-full group cursor-pointer relative">
                {bar.overlay && (
                  <div className={`absolute ${bar.overlayPos} w-3 h-3 bg-primary border-2 border-white rounded-full z-10 shadow-sm animate-pulse`} />
                )}
                <div className={`w-full rounded-t-lg transition-all duration-300 ${
                  bar.active 
                    ? index === 5
                      ? 'bg-primary ring-4 ring-primary/10'
                      : 'bg-primary/50 group-hover:bg-primary/70'
                    : 'bg-slate-100 group-hover:bg-primary/20'
                } ${bar.val}`} />
                <span className={`text-[10px] font-extrabold ${bar.active ? 'text-primary' : 'text-text-secondary'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>

          {/* Micro metric items footer */}
          <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-black/5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider leading-none">Avg. Review Time</p>
                <p className="text-xs font-extrabold text-text-primary mt-1">14.2 Min</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-black/5">
              <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center text-success-green">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider leading-none">Submission Accuracy</p>
                <p className="text-xs font-extrabold text-text-primary mt-1">92.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Competency Map Column */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full">
            <h4 className="font-bold text-sm text-text-primary">Competency Map</h4>
            <p className="text-[11px] text-text-secondary mt-0.5">Core Residency Standards</p>
          </div>

          {/* Radar spider drawing */}
          <div className="relative w-full max-w-[200px] aspect-square flex items-center justify-center py-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Pentagonal grids */}
              <polygon fill="none" points="50,10 90,40 75,85 25,85 10,40" stroke="#e2e8f0" strokeWidth="0.5"></polygon>
              <polygon fill="none" points="50,20 82,42 70,78 30,78 18,42" stroke="#e2e8f0" strokeWidth="0.5"></polygon>
              <polygon fill="none" points="50,30 74,44 65,71 35,71 26,44" stroke="#e2e8f0" strokeWidth="0.5"></polygon>
              <polygon fill="none" points="50,40 66,47 60,63 40,63 34,47" stroke="#e2e8f0" strokeWidth="0.5"></polygon>
              
              {/* Spokes */}
              <line stroke="#e2e8f0" strokeWidth="0.5" x1="50" x2="50" y1="50" y2="10"></line>
              <line stroke="#e2e8f0" strokeWidth="0.5" x1="50" x2="90" y1="50" y2="40"></line>
              <line stroke="#e2e8f0" strokeWidth="0.5" x1="50" x2="75" y1="50" y2="85"></line>
              <line stroke="#e2e8f0" strokeWidth="0.5" x1="50" x2="25" y1="50" y2="85"></line>
              <line stroke="#e2e8f0" strokeWidth="0.5" x1="50" x2="10" y1="50" y2="40"></line>
              
              {/* Active filled polygon representing skill level */}
              <polygon 
                fill="rgba(37, 99, 235, 0.12)" 
                points="50,15 85,42 70,80 35,75 15,35" 
                stroke="#2563eb" 
                strokeLinejoin="round" 
                strokeWidth="1.5"
                className="radar-glow"
              ></polygon>

              {/* Glowing center point */}
              <circle cx="50" cy="50" r="3" fill="#2563eb" className="animate-pulse"></circle>
            </svg>

            {/* Labels overlay */}
            <span className="absolute top-0 text-[8px] font-black text-text-secondary uppercase tracking-tight">Diagnostics</span>
            <span className="absolute top-1/3 -right-2 text-[8px] font-black text-text-secondary uppercase tracking-tight text-right">Technical<br/>Skills</span>
            <span className="absolute bottom-1.5 right-3 text-[8px] font-black text-text-secondary uppercase tracking-tight">Ethics</span>
            <span className="absolute bottom-1.5 left-3 text-[8px] font-black text-text-secondary uppercase tracking-tight">Communication</span>
            <span className="absolute top-1/3 -left-2 text-[8px] font-black text-text-secondary uppercase tracking-tight text-left">Clinical<br/>Judgement</span>
          </div>

          <div className="w-full border-t border-black/5 pt-4 mt-2">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-text-secondary font-medium">Global Peer Ranking</span>
              <span className="font-extrabold text-primary">Top 8%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                className="h-full bg-primary"
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
