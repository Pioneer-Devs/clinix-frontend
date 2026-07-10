import React, { useEffect, useState } from 'react';
import { Activity, Settings, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import DashboardView from './components/DashboardView';
import Header from './components/Header';
import InvestigationsView from './components/InvestigationsView';
import LoginPage from './components/LoginPage';
import NewEncounterView from './components/NewEncounterView';
import PatientsView from './components/PatientsView';
import ReportsView from './components/ReportsView';
import QRModal from './components/wallet/QRModal';
import Sidebar from './components/Sidebar';
import StudentPortfolioView from './components/StudentPortfolioView';
import SupervisorReviewView from './components/SupervisorReviewView';
import {
  activityToEvent,
  approveEncounter,
  createPatient,
  finalizeEncounter,
  getActivity,
  getEncounters,
  getInventory,
  getMe,
  getPatients,
  getPortfolio,
  getPortfolioStats,
  rejectEncounter,
} from './lib/api';
import WalletViewPage from './pages/WalletViewPage';
import {
  ActivityEvent,
  ApiEncounter,
  ApiInventory,
  ApiPatientCreate,
  ApiPortfolio,
  ApiPortfolioStats,
  ClinicalProcedure,
  mapPatient,
  Patient,
  User,
} from './types';

function procedureFromEncounter(encounter: ApiEncounter): ClinicalProcedure {
  const createdAt = new Date(encounter.finalized_at || encounter.updated_at || encounter.created_at);
  return {
    date: createdAt.toLocaleDateString(),
    time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    id: encounter.id,
    name: encounter.working_diagnosis || encounter.chief_complaint,
    setting: 'Clinical Encounter',
    supervisor: {
      name: encounter.supervisor_id ? 'Assigned Supervisor' : 'Pending Supervisor',
      role: encounter.supervisor_id ? 'Clinical Supervisor' : 'Awaiting Review',
    },
    seal: encounter.supervisor_id ? `SIGNED-${encounter.id.slice(0, 8)}` : 'PENDING',
    credits: encounter.credits_earned || 0,
  };
}

export default function App() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('clinix_token') || '');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('clinix_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [logs, setLogs] = useState<ActivityEvent[]>([]);
  const [encounters, setEncounters] = useState<ApiEncounter[]>([]);
  const [portfolio, setPortfolio] = useState<ApiPortfolio | null>(null);
  const [portfolioStats, setPortfolioStats] = useState<ApiPortfolioStats | null>(null);
  const [inventory, setInventory] = useState<ApiInventory | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showWalletSuccess, setShowWalletSuccess] = useState(false);
  const [walletPatientId, setWalletPatientId] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [walletAutoSync, setWalletAutoSync] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const refreshData = async () => {
    if (!token) return;
    setDataLoading(true);
    setDataError('');
    try {
      const [encounterRows, patientRows, activityRows, portfolioRow, statsRow, inventoryRow] = await Promise.all([
        getEncounters(token),
        getPatients(token, searchValue),
        getActivity(token),
        getPortfolio(token),
        getPortfolioStats(token),
        getInventory(token),
      ]);
      setEncounters(encounterRows);
      const mappedPatients = patientRows.map((patient) => mapPatient(patient, encounterRows));
      setPatients(mappedPatients);
      setSelectedPatientId((previous) => previous || mappedPatients[0]?.id || '');
      setLogs(activityRows.map(activityToEvent));
      setPortfolio(portfolioRow);
      setPortfolioStats(statsRow);
      setInventory(inventoryRow);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Unable to load Clinix data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [token, searchValue]);

  // Validate stored token on mount — log out if it's expired/invalid
  useEffect(() => {
    if (!token) return;
    getMe(token).catch(() => handleLogout());
  }, []);

  const handleLogin = (user: User, nextToken: string) => {
    localStorage.setItem('clinix_token', nextToken);
    localStorage.setItem('clinix_user', JSON.stringify(user));
    setCurrentUser(user);
    setToken(nextToken);
    triggerToast(`Welcome back, ${user.firstName}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('clinix_token');
    localStorage.removeItem('clinix_user');
    setCurrentUser(null);
    setToken('');
    setPatients([]);
    setLogs([]);
    setEncounters([]);
    setPortfolio(null);
    setPortfolioStats(null);
    setCurrentTab('dashboard');
    setSearchValue('');
  };

  const handleStartEncounter = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentTab('new-encounter');
  };

  const handleCreatePatient = async (payload: ApiPatientCreate) => {
    const newPatient = await createPatient(token, payload);
    await refreshData();
    triggerToast(`Patient ${newPatient.first_name} ${newPatient.last_name} registered`);
    // Pre-select the new patient and go straight to new encounter
    setSelectedPatientId(newPatient.id);
    setCurrentTab('new-encounter');
  };

  const handleEncounterFinalized = async (patientId: string, encounterId: string) => {
    await refreshData();
    triggerToast(`Encounter ${encounterId.slice(0, 8)} finalized for review`);
  };

  const handleApproveEncounter = async (encounterId: string, notes: string) => {
    const encounter = await approveEncounter(token, encounterId, notes);
    setWalletPatientId(encounter.patient_id);
    setShowWalletSuccess(walletAutoSync);
    await refreshData();
    triggerToast('Encounter approved and signed');
  };

  const handleRejectEncounter = async (encounterId: string, notes: string) => {
    await rejectEncounter(token, encounterId, notes);
    await refreshData();
    triggerToast('Encounter returned for changes');
  };

  if (location.pathname === '/wallet/view') {
    return <WalletViewPage />;
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const procedures = encounters
    .filter((encounter) => encounter.status === 'finalized')
    .map(procedureFromEncounter);
  const pendingEncounters = encounters.filter((encounter) => encounter.status === 'pending_review');

  const headerInfo = {
    dashboard: { title: 'Clinical Dashboard', subtitle: currentUser.hospital || 'Clinix' },
    'new-encounter': { title: 'New Clinical Encounter', subtitle: 'Interactive Diagnostic Intake' },
    'case-review': { title: 'Supervisor Review', subtitle: 'Case Validation & Approval' },
    patients: { title: 'Patient Queue', subtitle: 'Active Patient Registry' },
    investigations: { title: 'Investigations', subtitle: 'Lab Orders & Diagnostics' },
    reports: { title: 'Reports', subtitle: 'Audit & Performance Analytics' },
    portfolio: { title: 'Student Portfolio', subtitle: `${currentUser.firstName} ${currentUser.lastName} - Performance Records` },
  }[currentTab] || { title: 'Clinical Dashboard', subtitle: '' };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            patients={patients}
            logs={logs}
            portfolio={portfolio}
            pendingReviewCount={pendingEncounters.length}
            loading={dataLoading}
            error={dataError}
            onRetry={refreshData}
            onStartEncounter={handleStartEncounter}
            onOpenReview={() => setCurrentTab('case-review')}
            onViewAllQueue={() => setCurrentTab('patients')}
            onViewPortfolio={() => setCurrentTab('portfolio')}
          />
        );
      case 'new-encounter':
        return (
          <NewEncounterView
            token={token}
            patients={patients}
            selectedPatientId={selectedPatientId}
            loading={dataLoading}
            error={dataError}
            onRetry={refreshData}
            onPatientSelect={setSelectedPatientId}
            onBack={() => setCurrentTab('dashboard')}
            onFinalized={handleEncounterFinalized}
          />
        );
      case 'case-review':
        return (
          <SupervisorReviewView
            encounters={pendingEncounters}
            patients={patients}
            loading={dataLoading}
            error={dataError}
            onRetry={refreshData}
            onBack={() => setCurrentTab('dashboard')}
            onApprove={handleApproveEncounter}
            onReject={handleRejectEncounter}
          />
        );
      case 'patients':
        return (
          <PatientsView
            patients={patients}
            loading={dataLoading}
            error={dataError}
            onRetry={refreshData}
            onStartEncounter={handleStartEncounter}
            onOpenWallet={(id) => { setWalletPatientId(id); setShowWalletSuccess(true); }}
            onCreatePatient={handleCreatePatient}
            searchValue={searchValue}
          />
        );
      case 'investigations':
        return <InvestigationsView inventory={inventory} loading={dataLoading} error={dataError} onRetry={refreshData} searchValue={searchValue} />;
      case 'reports':
        return <ReportsView stats={portfolioStats} logs={logs} loading={dataLoading} error={dataError} onRetry={refreshData} searchValue={searchValue} />;
      case 'portfolio':
        return (
          <StudentPortfolioView
            currentUser={currentUser}
            portfolio={portfolio}
            procedures={procedures}
            loading={dataLoading}
            error={dataError}
            onRetry={refreshData}
            searchValue={searchValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main font-sans flex antialiased">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSearchValue('');
        }}
        user={currentUser}
        pendingReviewCount={pendingEncounters.length}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSupport={() => setShowSupport(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 pl-56 flex flex-col min-h-screen">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          showBackButton={currentTab === 'new-encounter' || currentTab === 'case-review'}
          onBack={() => setCurrentTab('dashboard')}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          user={currentUser}
        />
        <main className="flex-1 pt-20 px-6 pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="fixed bottom-6 right-6 bg-primary text-white px-5 py-3.5 rounded-xl z-50 flex items-center gap-2.5 shadow-lg border border-white/5">
            <Activity className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowSettings(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-border relative z-10">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary">Settings</h3>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-1.5 hover:bg-bg-main rounded-xl text-text-secondary cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h5 className="font-semibold text-xs text-text-primary">Solid POD Auto-Sync</h5>
                    <p className="text-[10px] text-text-secondary mt-0.5">Auto-push approved encounter data to patient POD</p>
                  </div>
                  <input type="checkbox" checked={walletAutoSync} onChange={(e) => setWalletAutoSync(e.target.checked)} className="w-4 h-4 accent-primary rounded cursor-pointer" />
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-dark transition-all cursor-pointer">Save Changes</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowSupport(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-border relative z-10">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <img src="/logo.png" alt="Clinix" className="w-5 h-5 rounded-lg" />
                  Clinix Help
                </h3>
                <button onClick={() => setShowSupport(false)} className="p-1.5 hover:bg-bg-main rounded-xl text-text-secondary cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Clinix powers AI-guided clinical encounters, supervisor verification, and portable patient health records via Solid PODs.
              </p>
              <button onClick={() => setShowSupport(false)} className="mt-2 w-full py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-dark transition-all cursor-pointer">Got It</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showWalletSuccess && walletPatientId && (
        <QRModal
          onClose={() => {
            setShowWalletSuccess(false);
            setCurrentTab('dashboard');
          }}
          patientId={walletPatientId}
        />
      )}
    </div>
  );
}
