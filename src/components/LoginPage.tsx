import React, { useState } from 'react';
import { Activity, ArrowLeft, Eye, EyeOff, Shield, Stethoscope, User as UserIcon, Users } from 'lucide-react';
import EmailVerificationPage from './EmailVerificationPage';
import { login, register, resendVerification, verifyEmail } from '../lib/api';
import { mapUser, User } from '../types';

interface LoginPageProps {
  onLogin: (user: User, token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<'role' | 'login' | 'register' | 'verification'>('role');
  const [role, setRole] = useState<'student' | 'supervisor' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('500');
  const [matricNumber, setMatricNumber] = useState('');
  const [hospital, setHospital] = useState('');
  const [mdcnRegNo, setMdcnRegNo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole: 'student' | 'supervisor') => {
    setRole(selectedRole);
    setView('login');
    setError('');
  };

  const handleLoginSubmit = async () => {
    if (!role) return;
    setError('');
    setIsLoading(true);
    try {
      const tokenResponse = await login({ email, password });
      const userModule = await import('../lib/api');
      const apiUser = await userModule.getMe(tokenResponse.access_token);
      if (apiUser.role !== role) {
        throw new Error(`This account is registered as ${apiUser.role}. Please sign in through the matching role.`);
      }
      onLogin(mapUser(apiUser), tokenResponse.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    if (!role) return;
    setError('');
    setIsLoading(true);
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
        year_of_study: role === 'student' ? Number(yearOfStudy) : undefined,
        matric_number: role === 'student' ? matricNumber : undefined,
        hospital,
        mdcn_reg_no: role === 'supervisor' ? mdcnRegNo : undefined,
      });
      // Bypass verification step
      const tokenResponse = await login({ email, password });
      const userModule = await import('../lib/api');
      const apiUser = await userModule.getMe(tokenResponse.access_token);
      onLogin(mapUser(apiUser), tokenResponse.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    setError('');
    setIsLoading(true);
    try {
      await verifyEmail({ email, code });
      const tokenResponse = await login({ email, password });
      const userModule = await import('../lib/api');
      const apiUser = await userModule.getMe(tokenResponse.access_token);
      if (apiUser.role !== role) {
        throw new Error(`This account is registered as ${apiUser.role}. Please sign in through the matching role.`);
      }
      onLogin(mapUser(apiUser), tokenResponse.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setIsLoading(true);
    try {
      await resendVerification(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Activity, title: 'Clinical Encounters', desc: 'Streamlined intake, vitals, and diagnostics tracking.' },
    { icon: Shield, title: 'Verified Credentials', desc: 'Securely logged student encounters and supervisor reviews.' },
    { icon: Users, title: 'Patient Management', desc: 'Integrated patient queuing and records management system.' },
  ];

  if (view === 'verification') {
    return (
      <EmailVerificationPage
        email={email}
        error={error}
        loading={isLoading}
        onBack={() => setView('register')}
        onVerify={handleVerificationSubmit}
        onResend={handleResendVerification}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center bg-white rounded-xl shadow-sm border border-border overflow-hidden min-h-[600px]">
        <div className="bg-sidebar-bg text-white h-full p-8 lg:p-12 flex-col justify-center space-y-10 hidden lg:flex">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Clinix Logo" className="w-12 h-12 object-cover rounded shadow-sm" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Clinix</h1>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mt-0.5">Clinical Dashboard</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              A comprehensive system for tracking supervised patient encounters, verifying medical competence, and managing care workflows.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-white uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed max-w-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-12 lg:pl-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Clinix Logo" className="w-10 h-10 object-cover rounded" />
            <h1 className="text-xl font-bold tracking-tight">Clinix</h1>
          </div>

          {view === 'role' && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-text-primary">Select Your Role</h2>
                <p className="text-xs text-text-secondary mt-1">Choose how you want to access the platform.</p>
              </div>
              <button onClick={() => handleRoleSelect('student')} className="w-full flex items-center gap-4 p-5 rounded-lg border border-border bg-bg-main hover:border-primary transition-all text-left cursor-pointer group">
                <div className="p-3 bg-white rounded shadow-sm group-hover:text-primary"><UserIcon className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-sm text-text-primary">Medical Student</h3>
                  <p className="text-[10px] text-text-secondary mt-0.5">Log clinical encounters and build portfolio.</p>
                </div>
              </button>
              <button onClick={() => handleRoleSelect('supervisor')} className="w-full flex items-center gap-4 p-5 rounded-lg border border-border bg-bg-main hover:border-primary transition-all text-left cursor-pointer group">
                <div className="p-3 bg-white rounded shadow-sm group-hover:text-primary"><Stethoscope className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-sm text-text-primary">Clinical Supervisor</h3>
                  <p className="text-[10px] text-text-secondary mt-0.5">Review, validate, and sign student encounters.</p>
                </div>
              </button>
            </div>
          )}

          {view === 'login' && (
            <div>
              <button onClick={() => setView('role')} className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-6 flex items-center gap-1 hover:text-text-primary cursor-pointer">
                <ArrowLeft className="w-3 h-3" /> Back to roles
              </button>
              <div className="mb-8">
                <h2 className="text-lg font-bold text-text-primary">{role === 'student' ? 'Student Sign In' : 'Supervisor Sign In'}</h2>
                <p className="text-xs text-text-secondary mt-1">Enter your credentials to continue.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@clinix.ng" className="w-full px-3 py-2.5 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2.5 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                <button onClick={handleLoginSubmit} disabled={isLoading || !email || !password} className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded transition-colors mt-2 cursor-pointer disabled:opacity-70">
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
              <div className="mt-6 text-center text-[11px] text-text-secondary">
                Don't have an account?{' '}
                <button onClick={() => { setView('register'); setError(''); }} className="font-bold text-primary hover:underline cursor-pointer">Register as {role === 'student' ? 'Student' : 'Supervisor'}</button>
              </div>
            </div>
          )}

          {view === 'register' && (
            <div>
              <button onClick={() => setView('login')} className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-6 flex items-center gap-1 hover:text-text-primary cursor-pointer">
                <ArrowLeft className="w-3 h-3" /> Back to sign in
              </button>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-text-primary">{role === 'student' ? 'Student Registration' : 'Supervisor Registration'}</h2>
                <p className="text-xs text-text-secondary mt-1">Create your profile to get started.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input aria-label="First name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                  <input aria-label="Last name" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                </div>
                <input aria-label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                <input aria-label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                <input aria-label="Hospital" type="text" value={hospital} onChange={e => setHospital(e.target.value)} placeholder="Hospital / Institution" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-4">
                    <select value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)} className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none">
                      <option value="400">400L</option>
                      <option value="500">500L</option>
                      <option value="600">600L</option>
                    </select>
                    <input aria-label="Matric number" type="text" value={matricNumber} onChange={e => setMatricNumber(e.target.value)} placeholder="Matric number" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                  </div>
                )}
                {role === 'supervisor' && (
                  <input aria-label="MDCN registration number" type="text" value={mdcnRegNo} onChange={e => setMdcnRegNo(e.target.value)} placeholder="MDCN registration number" className="w-full px-3 py-2 rounded border border-border bg-bg-main text-sm focus:border-primary outline-none" />
                )}
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                <button onClick={handleRegisterSubmit} disabled={isLoading || !firstName || !lastName || !email || !password || !hospital} className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded transition-colors mt-4 cursor-pointer disabled:opacity-70">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
