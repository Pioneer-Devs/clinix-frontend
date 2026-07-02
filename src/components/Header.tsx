import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ArrowLeft,
  ChevronRight,
  User,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentRole: {
    name: string;
    title: string;
    avatarUrl: string;
  };
  onRoleClick?: () => void;
  rightActions?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  currentRole,
  onRoleClick,
  rightActions
}: HeaderProps) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const mockNotifications = [
    { id: '1', title: 'Critical Suggestion', desc: '4 prenatal screenings pending in Zone B.', type: 'urgent' },
    { id: '2', title: 'Public Health Alert', desc: 'Malaria cluster pattern detected in Ward 4.', type: 'alert' },
    { id: '3', title: 'Verification Request', desc: 'Case #892 awaiting validation signatures.', type: 'info' }
  ];

  return (
    <header 
      id="top-appbar"
      className="fixed top-0 right-0 w-[calc(100%-260px)] h-20 bg-white/80 backdrop-blur-xl z-40 px-10 border-b border-black/5 flex items-center justify-between"
    >
      {/* Left side: Navigation or Title */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-black/5 rounded-xl transition-colors text-text-secondary hover:text-primary cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div>
          <h2 className="font-page-title text-[24px] font-bold text-text-primary tracking-tight leading-tight flex items-center gap-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[12px] text-text-secondary font-medium tracking-wide mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4.5 h-4.5" />
          <input 
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-black/5 rounded-2xl pl-11 pr-4 py-2.5 focus:ring-4 focus:ring-primary/10 focus:border-primary/30 focus:bg-white outline-none text-sm transition-all shadow-inner placeholder:text-text-secondary/60 text-text-primary"
          />
        </div>
      </div>

      {/* Right actions: Actions, Notifications, User Role Profile */}
      <div className="flex items-center gap-6">
        {/* Contextual actions like "New Encounter" or "Approve & Sign" */}
        {rightActions && (
          <div className="flex items-center gap-3">
            {rightActions}
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="p-2.5 hover:bg-black/5 rounded-xl transition-all text-text-secondary hover:text-primary relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-red rounded-full ring-2 ring-white"></span>
          </button>

          <AnimatePresence>
            {showNotificationDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotificationDropdown(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-black/5 z-50 p-4"
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-black/5">
                    <h4 className="font-bold text-sm text-text-primary">Notifications</h4>
                    <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                    {mockNotifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${n.type === 'urgent' ? 'bg-danger-red' : n.type === 'alert' ? 'bg-warning-amber' : 'bg-primary'}`} />
                          <h5 className="font-semibold text-xs text-text-primary">{n.title}</h5>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-normal">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Role Profile */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-black/5 cursor-pointer select-none group"
          >
            <div className="text-right hidden sm:block">
              <p className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors">
                {currentRole.name}
              </p>
              <p className="text-[10px] text-text-secondary font-semibold tracking-wider uppercase opacity-75 mt-0.5">
                {currentRole.title}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/25 transition-all">
              <img 
                src={currentRole.avatarUrl} 
                alt={currentRole.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-black/5 z-50 p-3"
                >
                  <div className="px-3 py-2 border-b border-black/5 mb-2">
                    <p className="font-bold text-sm text-text-primary">{currentRole.name}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{currentRole.title}</p>
                  </div>
                  {onRoleClick && (
                    <button 
                      onClick={() => {
                        onRoleClick();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-primary/5 hover:text-primary text-xs font-semibold text-text-secondary transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Switch Clinical Perspective
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
