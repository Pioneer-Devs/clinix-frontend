import React, { useState } from 'react';
import { 
  Award, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  Beaker, 
  AlertOctagon, 
  ShieldAlert, 
  BookOpen, 
  FileDown, 
  SlidersHorizontal,
  Lock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { ClinicalProcedure } from '../types';

interface StudentPortfolioProps {
  procedures: ClinicalProcedure[];
  searchValue: string;
}

export default function StudentPortfolioView({
  procedures,
  searchValue
}: StudentPortfolioProps) {
  const [filterType, setFilterType] = useState<'All' | 'Surgical' | 'Emergency' | 'Diagnostics'>('All');

  // Filter logic based on tab search and component tags
  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = proc.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                          proc.id.toLowerCase().includes(searchValue.toLowerCase()) ||
                          proc.setting.toLowerCase().includes(searchValue.toLowerCase());
    
    if (filterType === 'All') return matchesSearch;
    if (filterType === 'Surgical') return matchesSearch && proc.name.toLowerCase().includes('sutur') || proc.name.toLowerCase().includes('thorac');
    if (filterType === 'Emergency') return matchesSearch && proc.setting.toLowerCase().includes('emergency') || proc.name.toLowerCase().includes('intrav');
    if (filterType === 'Diagnostics') return matchesSearch && proc.name.toLowerCase().includes('lab') || proc.name.toLowerCase().includes('test');
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 select-none">
      {/* Hero Section & Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border border-black/5 flex-shrink-0 z-10">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2jrG1JRxF3s25CMDH97_qph0Vv0BRxZb_UtewqQ5uwCXmp_58u7T94-wOASZDZleDasediH-15AlRrcSR4fLwMNQyB31BXYZpahvMIJ_CO4veLtfFKLbfGSQOTZwZlMA_dHtpK2p6DwEjQX3--Pi10KpcrIJhAjVD77JiRK77n5Z2U3KV1dD01KvxOnxBbvEk40cn0-T1EIlJ67Zd6yEzWE3LYTjHMU1Dgow6woMDJOsBFq5Qk9QsW00KG7WEg-ncEKSempYdIO8" 
              alt="Elena Rodriguez" 
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="z-10 text-center md:text-left space-y-3 flex-1">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h3 className="font-page-title text-[24px] font-bold text-text-primary">
                Dr. Elena Rodriguez
              </h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> MDCN-V-2024-081
              </span>
            </div>
            
            <p className="text-xs text-text-secondary font-semibold">
              Senior Surgical Resident • Teaching Hospital Ed. • Class of 2024
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-1">
              <div className="flex items-center justify-center gap-1.5 text-primary text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Lagos Central Hospital</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
                <Mail className="w-4 h-4" />
                <span>elena.r@clinix.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and certification summary */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Total Procedures</span>
              <span className="text-primary font-bold text-xs">+12%</span>
            </div>
            <div className="text-2xl font-black text-text-primary mb-3">1,482</div>
            <div className="h-6 w-full flex items-end gap-1 pb-1">
              <div className="w-2 bg-primary/20 h-4 rounded-t-sm"></div>
              <div className="w-2 bg-primary/20 h-6 rounded-t-sm"></div>
              <div className="w-2 bg-primary/40 h-5 rounded-t-sm"></div>
              <div className="w-2 bg-primary/60 h-8 rounded-t-sm"></div>
              <div className="w-2 bg-primary h-7 rounded-t-sm"></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-text-secondary text-[11px] font-bold uppercase tracking-wider">Accuracy Rate</span>
              <span className="text-success-green font-bold text-xs">High</span>
            </div>
            <div className="text-2xl font-black text-text-primary mb-3">99.2%</div>
            <div className="h-6 w-full flex items-center justify-center">
              <svg className="w-full h-3" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M0,10 Q25,2 50,10 T100,10" fill="none" stroke="#004ac6" strokeWidth="2.5"></path>
              </svg>
            </div>
          </div>

          <div className="col-span-2 bg-primary text-white p-5 rounded-3xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Portfolio Readiness</p>
              <h4 className="text-lg font-black mt-1">Certification Level: Gold</h4>
            </div>
            <div className="w-11 h-11 rounded-2xl border-2 border-white/20 bg-white/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-white animate-bounce-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Competency & Verified Credits */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competency Radar Graph */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-sm text-text-primary">Clinical Competency Radar</h4>
              <p className="text-[10px] text-text-secondary mt-0.5">Core assessment benchmarks</p>
            </div>
            <Compass className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4">
            <svg className="w-56 h-56" viewBox="0 0 200 200">
              {/* Outer boundary */}
              <polygon fill="none" points="100,20 180,60 180,140 100,180 20,140 20,60" stroke="#eceef0" strokeWidth="1"></polygon>
              {/* Inner boundary */}
              <polygon fill="none" points="100,50 150,75 150,125 100,150 50,125 50,75" stroke="#eceef0" strokeWidth="1"></polygon>
              
              {/* Axis wires */}
              <line stroke="#eceef0" strokeWidth="1" x1="100" x2="100" y1="20" y2="180"></line>
              <line stroke="#eceef0" strokeWidth="1" x1="20" x2="180" y1="60" y2="140"></line>
              <line stroke="#eceef0" strokeWidth="1" x1="20" x2="180" y1="140" y2="60"></line>
              
              {/* Filled mapping representing actual resident scores */}
              <polygon 
                fill="rgba(37, 99, 235, 0.15)" 
                points="100,35 170,75 160,130 100,165 40,120 45,70" 
                stroke="#2563eb" 
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="radar-expertise"
              ></polygon>

              {/* Glowing anchor dots */}
              <circle cx="100" cy="35" fill="#2563eb" r="3.5" />
              <circle cx="170" cy="75" fill="#2563eb" r="3.5" />
              <circle cx="160" cy="130" fill="#2563eb" r="3.5" />
              <circle cx="100" cy="165" fill="#2563eb" r="3.5" />
            </svg>

            {/* Float labels */}
            <div className="absolute inset-0 pointer-events-none text-[8px] font-extrabold text-text-secondary">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 uppercase">Surgery</span>
              <span className="absolute top-1/4 right-0 uppercase">Diagnostics</span>
              <span className="absolute bottom-1/4 right-0 uppercase">Patient Care</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 uppercase">Research</span>
              <span className="absolute bottom-1/4 left-0 uppercase">Ethics</span>
              <span className="absolute top-1/4 left-0 uppercase">Emergency</span>
            </div>
          </div>
        </div>

        {/* Verified clinical credits cards */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-text-primary">Verified Clinical Credits</h4>
            <span className="text-text-secondary text-xs font-semibold">Residency Logbook</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Hematology */}
            <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm border-l-4 border-primary flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/5 rounded-xl text-primary">
                  <Beaker className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-extrabold text-text-secondary uppercase tracking-wider">
                  In Progress
                </span>
              </div>
              <div>
                <h5 className="font-bold text-sm text-text-primary">Hematology Lab Cycle</h5>
                <p className="text-[11px] text-text-secondary mt-0.5">LCH Diagnostics Center</p>
              </div>
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>82% Complete</span>
                  <span>12/15 Cases</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[82%]" />
                </div>
              </div>
            </div>

            {/* Trauma Rotation */}
            <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm border-l-4 border-secondary flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary/5 rounded-xl text-secondary">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-secondary/10 px-2 py-0.5 rounded font-extrabold text-secondary uppercase tracking-wider">
                  Critical Path
                </span>
              </div>
              <div>
                <h5 className="font-bold text-sm text-text-primary">ER Trauma Rotation</h5>
                <p className="text-[11px] text-text-secondary mt-0.5">Night Shift (Triage Beta)</p>
              </div>
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>45% Complete</span>
                  <span>4/10 Procedures</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[45%]" />
                </div>
              </div>
            </div>

            {/* Advanced Cardiac Life Support */}
            <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm border-l-4 border-primary col-span-1 md:col-span-2 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                <BookOpen className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-text-primary leading-tight">
                      Advanced Cardiac Life Support (ACLS)
                    </h5>
                    <p className="text-xs text-text-secondary mt-0.5">Certification valid until Dec 2026</p>
                  </div>
                  
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] text-text-secondary mt-1 font-mono">0x71C...a49</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Procedures log table */}
      <section className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
          <div>
            <h4 className="font-bold text-sm text-text-primary">Verified Clinical Procedures Log</h4>
            <p className="text-[11px] text-text-secondary mt-0.5">Showing completed credentials and cryptographic seals</p>
          </div>

          {/* Table filter select buttons */}
          <div className="flex gap-2 flex-wrap">
            {(['All', 'Surgical', 'Emergency', 'Diagnostics'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-secondary border-black/5 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/70 border-b border-black/5 text-[10px] uppercase font-bold text-text-secondary tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Procedure ID</th>
                <th className="px-6 py-4">Clinical Setting</th>
                <th className="px-6 py-4">Supervisor</th>
                <th className="px-6 py-4 text-right">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-xs text-text-primary">
              {filteredProcedures.length > 0 ? (
                filteredProcedures.map((proc, idx) => (
                  <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold">{proc.date}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5">{proc.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-text-primary group-hover:text-primary transition-colors">{proc.name}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5">Ref: {proc.id}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-medium">
                      {proc.setting}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-black/5 bg-slate-100 flex-shrink-0">
                          <img 
                            src={proc.supervisor.avatarUrl} 
                            alt={proc.supervisor.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[11px] text-text-primary">{proc.supervisor.name}</p>
                          <p className="text-[9px] text-text-secondary font-medium">{proc.supervisor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary to-primary-container text-white rounded-full text-[9px] font-mono font-bold shadow-md shadow-primary/10">
                        <Lock className="w-3 h-3 text-white" />
                        {proc.seal}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-secondary font-semibold">
                    No verified procedures found matching the active search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-black/5 text-center">
          <button className="text-primary font-bold text-xs hover:underline cursor-pointer flex items-center gap-1.5 mx-auto">
            <FileDown className="w-4 h-4" /> Download Comprehensive Logbook (.pdf)
          </button>
        </div>
      </section>
    </div>
  );
}
