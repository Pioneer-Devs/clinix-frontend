import React, { useState } from 'react';
import { 
  Plus, 
  HelpCircle, 
  Settings, 
  Sparkles, 
  Check, 
  X, 
  Bot, 
  Activity, 
  UserCheck, 
  SlidersHorizontal, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import NewEncounterView from './components/NewEncounterView';
import SupervisorReviewView from './components/SupervisorReviewView';
import StudentPortfolioView from './components/StudentPortfolioView';
import WalletSuccessView from './components/WalletSuccessView';
import PatientsView from './components/PatientsView';
import InvestigationsView from './components/InvestigationsView';
import ReportsView from './components/ReportsView';
import { Patient, SystemLog, ClinicalProcedure } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Pre-seeded hospital data
const initialPatients: Patient[] = [
  {
    id: 'pat-1',
    name: 'Fatima Abdullahi',
    age: 24,
    gender: 'Female',
    mrn: '4492-AX',
    bloodType: 'O+ Positive',
    ward: 'Ward 2A',
    avatarInitials: 'FA',
    chiefComplaint: 'Persistent high-grade fever, intense headache, and rigors over the last 3 days.',
    arrivalText: 'Arrived 15m ago',
    urgency: 'Urgent',
    vitals: { temp: 38.5, bp: '120/80', pulse: 88, spo2: 98 }
  },
  {
    id: 'pat-2',
    name: 'James Okafor',
    age: 45,
    gender: 'Male',
    mrn: '3021-CZ',
    bloodType: 'A- Negative',
    ward: 'Ward 1C',
    avatarInitials: 'JO',
    chiefComplaint: 'Substernal chest pressure and pain during exertion, radiating slightly to shoulder.',
    arrivalText: 'Arrived 1h ago',
    urgency: 'Waiting',
    vitals: { temp: 36.8, bp: '142/90', pulse: 76, spo2: 95 }
  },
  {
    id: 'pat-3',
    name: 'Chioma Adeleke',
    age: 32,
    gender: 'Female',
    mrn: '9910-BY',
    bloodType: 'B+ Positive',
    ward: 'Clinic B',
    avatarInitials: 'CA',
    chiefComplaint: 'Routine 24-week prenatal check-up. Reports normal fetal movement, mild back fatigue.',
    arrivalText: 'Arrived 2h ago',
    urgency: 'Routine',
    vitals: { temp: 37.0, bp: '115/75', pulse: 72, spo2: 99 }
  }
];

const initialLogs: SystemLog[] = [
  {
    id: 'log-1',
    type: 'verified',
    title: 'Verified: Clinical Case #892',
    description: 'Final validation signed off by Dr. Alaric Thorne • Pathology included.',
    timeAgo: '2M AGO'
  },
  {
    id: 'log-2',
    type: 'autosave',
    title: 'Autosave: Case #894 Draft',
    description: 'Patient: Fatima Abdullahi • AI intake draft updated.',
    timeAgo: '15M AGO'
  },
  {
    id: 'log-3',
    type: 'pending',
    title: 'Awaiting Review: Case #893',
    description: 'Pending supervisor review and signature confirmation.',
    timeAgo: '1H AGO'
  }
];

const initialProcedures: ClinicalProcedure[] = [
  {
    date: '12 Nov',
    time: '14:30',
    id: 'PROC-9024',
    name: 'Thoracentesis',
    setting: 'Emergency Department',
    supervisor: {
      name: 'Dr. Alaric Thorne',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQG3t7F0H25Z8K9mS-Vpt_BshXvL5qKWh7g83AunFWhEwLg4X9Y8O0_2k98O1_2P_a18L9W0S_qB8qR7_0K_9O-S3_1K19-P_9K_9w=s96-c',
      role: 'Chief Attending'
    },
    seal: 'VERIFIED_9X72'
  },
  {
    date: '10 Nov',
    time: '09:15',
    id: 'PROC-8890',
    name: 'Intravenous Access',
    setting: 'Intensive Care Unit',
    supervisor: {
      name: 'Dr. Sarah Chen',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQG3t7F0H25Z8K9mS-Vpt_BshXvL5qKWh7g83AunFWhEwLg4X9Y8O0_2k98O1_2P_a18L9W0S_qB8qR7_0K_9O-S3_1K19-P_9K_9w=s96-c',
      role: 'Surgical Specialist'
    },
    seal: 'VERIFIED_1K02'
  },
  {
    date: '05 Nov',
    time: '11:00',
    id: 'PROC-8211',
    name: 'Laparoscopic Suturing',
    setting: 'Operating Theatre A',
    supervisor: {
      name: 'Dr. Elena Rodriguez',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2jrG1JRxF3s25CMDH97_qph0Vv0BRxZb_UtewqQ5uwCXmp_58u7T94-wOASZDZleDasediH-15AlRrcSR4fLwMNQyB31BXYZpahvMIJ_CO4veLtfFKLbfGSQOTZwZlMA_dHtpK2p6DwEjQX3--Pi10KpcrIJhAjVD77JiRK77n5Z2U3KV1dD01KvxOnxBbvEk40cn0-T1EIlJ67Zd6yEzWE3LYTjHMU1Dgow6woMDJOsBFq5Qk9QsW00KG7WEg-ncEKSempYdIO8',
      role: 'Senior Surgical Resident'
    },
    seal: 'VERIFIED_6M91'
  }
];

// Clinical roles that users can toggle through
const roles = [
  {
    id: 'role-1',
    name: 'Dr. Alaric Thorne',
    title: 'Attending Physician & Clinical Supervisor',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQG3t7F0H25Z8K9mS-Vpt_BshXvL5qKWh7g83AunFWhEwLg4X9Y8O0_2k98O1_2P_a18L9W0S_qB8qR7_0K_9O-S3_1K19-P_9K_9w=s96-c'
  },
  {
    id: 'role-2',
    name: 'Dr. Elena Rodriguez',
    title: 'Senior Surgical Resident (MDCN-V-2024)',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2jrG1JRxF3s25CMDH97_qph0Vv0BRxZb_UtewqQ5uwCXmp_58u7T94-wOASZDZleDasediH-15AlRrcSR4fLwMNQyB31BXYZpahvMIJ_CO4veLtfFKLbfGSQOTZwZlMA_dHtpK2p6DwEjQX3--Pi10KpcrIJhAjVD77JiRK77n5Z2U3KV1dD01KvxOnxBbvEk40cn0-T1EIlJ67Zd6yEzWE3LYTjHMU1Dgow6woMDJOsBFq5Qk9QsW00KG7WEg-ncEKSempYdIO8'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('pat-1');
  const [searchValue, setSearchValue] = useState('');
  
  // States holding current databases
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [procedures, setProcedures] = useState<ClinicalProcedure[]>(initialProcedures);
  
  // Active clinical perspective role
  const [roleIndex, setRoleIndex] = useState(1); // Default to Elena (Resident)
  const currentRole = roles[roleIndex];

  // Modal and Special views states
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showWalletSuccess, setShowWalletSuccess] = useState(false);
  const [walletDetails, setWalletDetails] = useState({ patientName: '', diagnosis: '' });
  
  // Quick notification bubble helper
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCycleRole = () => {
    const nextIdx = (roleIndex + 1) % roles.length;
    setRoleIndex(nextIdx);
    triggerToast(`Switched Perspective to: ${roles[nextIdx].name}`);
  };

  const handleStartEncounter = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentTab('new-encounter');
  };

  // Finalize diagnostic record & show sovereign success wallet
  const handleFinalizeEncounter = (patientId: string, diagnosis: string, vitals: any) => {
    const matchedPat = patients.find(p => p.id === patientId);
    const patName = matchedPat ? matchedPat.name : 'Unknown Patient';

    // Update locally persisted variables
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          vitals,
          workingDiagnosis: diagnosis,
          urgency: 'Routine' // downgraded urgency after intake!
        };
      }
      return p;
    }));

    // Add logging item
    const newLogId = 'log-' + (logs.length + 1);
    const newLogEntry: SystemLog = {
      id: newLogId,
      type: 'verified',
      title: `Finalized: Case #${Math.floor(100 + Math.random() * 800)}`,
      description: `Patient: ${patName} • Diagnostic code locked and signed.`,
      timeAgo: '1S AGO'
    };
    setLogs([newLogEntry, ...logs]);

    // Update procedures list
    const newProc: ClinicalProcedure = {
      date: 'Today',
      time: '14:45',
      id: `PROC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Intake Evaluation (${diagnosis})`,
      setting: 'Triage Center',
      supervisor: {
        name: 'Dr. Alaric Thorne',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQG3t7F0H25Z8K9mS-Vpt_BshXvL5qKWh7g83AunFWhEwLg4X9Y8O0_2k98O1_2P_a18L9W0S_qB8qR7_0K_9O-S3_1K19-P_9K_9w=s96-c',
        role: 'Chief Attending'
      },
      seal: `VERIFIED_${Math.floor(100 + Math.random() * 900)}X`
    };
    setProcedures([newProc, ...procedures]);

    // Launch digital success credentials
    setWalletDetails({ patientName: patName, diagnosis });
    setShowWalletSuccess(true);
  };

  const handleApproveAndSignSupervisor = (patientName: string, diagnosis: string) => {
    triggerToast(`Successfully approved and signed diagnostic report for ${patientName}`);
    setCurrentTab('dashboard');
  };

  // Settings custom settings toggles
  const [mcpEndpoint, setMcpEndpoint] = useState('localhost:8000/clinical');
  const [ambientAudio, setAmbientAudio] = useState(true);
  const [walletAutoSync, setWalletAutoSync] = useState(true);

  // Router selector content renderer
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            patients={patients}
            logs={logs}
            onStartEncounter={handleStartEncounter}
            onOpenReview={() => setCurrentTab('case-review')}
            onViewAllQueue={() => setCurrentTab('patients')}
            onViewPortfolio={() => setCurrentTab('portfolio')}
          />
        );
      case 'new-encounter':
        return (
          <NewEncounterView
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={setSelectedPatientId}
            onBack={() => setCurrentTab('dashboard')}
            onFinalize={handleFinalizeEncounter}
          />
        );
      case 'case-review':
        return (
          <SupervisorReviewView
            onBack={() => setCurrentTab('dashboard')}
            onApproveAndSign={handleApproveAndSignSupervisor}
          />
        );
      case 'patients':
        return (
          <PatientsView
            patients={patients}
            onStartEncounter={handleStartEncounter}
            searchValue={searchValue}
          />
        );
      case 'investigations':
        return (
          <InvestigationsView searchValue={searchValue} />
        );
      case 'reports':
        return (
          <ReportsView searchValue={searchValue} />
        );
      case 'portfolio':
        return (
          <StudentPortfolioView 
            procedures={procedures}
            searchValue={searchValue}
          />
        );
      default:
        return (
          <DashboardView
            patients={patients}
            logs={logs}
            onStartEncounter={handleStartEncounter}
            onOpenReview={() => setCurrentTab('case-review')}
            onViewAllQueue={() => setCurrentTab('patients')}
            onViewPortfolio={() => setCurrentTab('portfolio')}
          />
        );
    }
  };

  // Determine current screen title representation in topbar header
  const getHeaderTitleAndSubtitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Clinical Dashboard', subtitle: 'Teaching Hospital Telemetry & Diagnostics' };
      case 'new-encounter':
        return { title: 'New Clinical Encounter', subtitle: 'Interactive Diagnostic Intake' };
      case 'case-review':
        return { title: 'Supervisor Review Portal', subtitle: 'Senior Residency Validation' };
      case 'patients':
        return { title: 'Patients Directory', subtitle: 'Hospital Ward Registrations' };
      case 'investigations':
        return { title: 'Investigations Hub', subtitle: 'Specimens, Pathologies & Lab Outcomes' };
      case 'reports':
        return { title: 'Analytical Reports', subtitle: 'System Quality Records & Compliance' };
      case 'portfolio':
        return { title: 'Student Residency Portfolio', subtitle: 'Dr. Elena Rodriguez • Performance Records' };
      default:
        return { title: 'Clinical Dashboard', subtitle: '' };
    }
  };

  const { title: headerTitle, subtitle: headerSubtitle } = getHeaderTitleAndSubtitle();

  // Helper buttons for context actions inside header
  const renderHeaderRightActions = () => {
    if (currentTab === 'dashboard') {
      return (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab('case-review')}
            className="px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            Review Panel Pending
          </button>
          <button 
            onClick={() => handleStartEncounter('pat-1')}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> New Encounter
          </button>
        </div>
      );
    }
    if (currentTab === 'portfolio') {
      return (
        <button className="px-5 py-2.5 bg-success-green hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider">
          Export MDCN Verified
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-text-primary mesh-gradient font-sans flex antialiased">
      {/* Side Navigation Menu */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSearchValue('');
        }}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSupport={() => setShowSupport(true)}
      />

      {/* Main body canvas (offsets sidebar) */}
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
        <Header 
          title={headerTitle}
          subtitle={headerSubtitle}
          showBackButton={currentTab === 'new-encounter' || currentTab === 'case-review'}
          onBack={() => setCurrentTab('dashboard')}
          searchPlaceholder="Search patients, medical codes or diagnostics..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          currentRole={currentRole}
          onRoleClick={handleCycleRole}
          rightActions={renderHeaderRightActions()}
        />

        {/* Dynamic Inner Tab Content Container */}
        <main className="flex-1 pt-28 px-10 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Toast notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl z-50 flex items-center gap-2.5 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Dialog Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative z-10 text-text-primary"
          >
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-black/5">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-text-primary">
                <Settings className="w-5 h-5 text-primary" /> Clinix OS Setup
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-black/5 rounded-full text-text-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Clinic Server Endpoint (MCP)
                </label>
                <input 
                  type="text" 
                  value={mcpEndpoint}
                  onChange={(e) => setMcpEndpoint(e.target.value)}
                  className="w-full bg-slate-50 border border-black/5 rounded-2xl px-4 py-2.5 text-xs outline-none focus:ring-4 focus:ring-primary/10 font-mono text-primary font-bold"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h5 className="font-bold text-xs">Audio Intake Capture</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5">Automated listening during examinations</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={ambientAudio}
                  onChange={(e) => setAmbientAudio(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-100 border-black/5 rounded focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-black/5">
                <div>
                  <h5 className="font-bold text-xs">Cryptographic Wallet Auto-Sync</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5">Generate and sync sovereign keys immediately</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={walletAutoSync}
                  onChange={(e) => setWalletAutoSync(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-100 border-black/5 rounded focus:ring-primary cursor-pointer"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-3.5 bg-primary text-white font-extrabold rounded-2xl text-xs hover:bg-primary-container transition-colors uppercase tracking-wider cursor-pointer"
            >
              Apply Configurations
            </button>
          </motion.div>
        </div>
      )}

      {/* Support Dialog Overlay */}
      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSupport(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative z-10 text-text-primary"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/5">
              <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-text-primary">
                <HelpCircle className="w-5 h-5 text-primary" /> Clinix OS Help
              </h3>
              <button 
                onClick={() => setShowSupport(false)}
                className="p-1 hover:bg-black/5 rounded-full text-text-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Clinix OS integrates real-time clinical dashboards, AI-assisted diagnosis models, supervisor review portals, and student residency portfolios.
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-text-primary">Key Instructions:</p>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-5">
                <li><span className="font-semibold text-text-primary">Click on patient tiles</span> in the queue or Patient Directory to load and begin an intake encounter.</li>
                <li><span className="font-semibold text-text-primary">Adjust vitals directly</span> inside the vital sign array to see AI confidence adjust instantly.</li>
                <li><span className="font-semibold text-text-primary">Click the Doctor Profile picture</span> in the top-right to switch clinical perspectives.</li>
              </ul>
            </div>

            <button 
              onClick={() => setShowSupport(false)}
              className="mt-6 w-full py-3.5 bg-primary text-white font-bold rounded-2xl text-xs hover:bg-primary-container transition-colors uppercase tracking-wider cursor-pointer"
            >
              Close Guide
            </button>
          </motion.div>
        </div>
      )}

      {/* Sovereign success credentials wallet popup */}
      {showWalletSuccess && (
        <WalletSuccessView 
          onClose={() => setShowWalletSuccess(false)}
          patientName={walletDetails.patientName}
          diagnosis={walletDetails.diagnosis}
        />
      )}
    </div>
  );
}
