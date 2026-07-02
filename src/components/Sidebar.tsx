import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  FileText, 
  Settings, 
  HelpCircle,
  GraduationCap,
  Beaker,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export default function Sidebar({ 
  currentTab, 
  onTabChange, 
  onOpenSettings, 
  onOpenSupport 
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'encounters', label: 'Encounters', icon: Activity },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'investigations', label: 'Investigations', icon: Beaker },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: GraduationCap },
  ];

  return (
    <aside 
      id="side-navbar"
      className="w-[260px] h-screen fixed left-0 top-0 flex flex-col py-8 glass-sidebar z-50 select-none"
    >
      {/* Brand Header */}
      <div className="px-8 mb-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={2.5} />
          <h1 className="font-page-title text-[24px] font-extrabold text-primary tracking-tighter leading-none">
            Clinix OS
          </h1>
        </div>
        <p className="font-label-sm text-[11px] text-text-secondary uppercase tracking-widest mt-1.5 font-semibold">
          Teaching Hospital Ed.
        </p>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                isActive 
                  ? 'text-primary font-bold bg-primary/10 shadow-sm border-r-4 border-primary' 
                  : 'text-text-secondary hover:bg-black/5 hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon 
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="font-body-semibold text-[14px] leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Secondary Bottom Links */}
      <div className="px-4 mt-auto space-y-1 pt-6 border-t border-black/5">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-black/5 hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <Settings className="w-5 h-5" />
          <span className="font-body-semibold text-[14px]">Settings</span>
        </button>
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-black/5 hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-body-semibold text-[14px]">Support</span>
        </button>
      </div>
    </aside>
  );
}
