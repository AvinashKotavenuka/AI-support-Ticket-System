import React from 'react';
import { User } from '../types';
import { 
  ShieldCheck, Crown, LogIn, LogOut, User as UserIcon, 
  HelpCircle, Sparkles, MessageSquare
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  users: User[];
  onCreateTicketClick: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  users,
  onCreateTicketClick,
  onOpenAuthModal
}) => {
  const pendingCount = users.filter(u => u.role === 'agent' && u.is_approved === false).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title (Single text element) */}
        <div 
          className="flex items-center gap-2.5 shrink-0 cursor-pointer" 
          onClick={() => setActiveTab(currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'agent' ? 'agent' : 'home')}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs text-xs">
            AI
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            AI Support
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean & Professional 4-item contract) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          
          {/* 1. Home / Helpdesk */}
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>
          
          {/* 2. How It Works */}
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'how-it-works'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            How It Works
          </button>

          {/* 3. Contact */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Contact
          </button>

          {/* 4. Role Specific Tab: Agent Desk (if agent), Admin Panel (if admin), My Tickets (if customer) */}
          {currentUser && (
            <button
              onClick={() => {
                if (currentUser.role === 'admin') setActiveTab('admin');
                else if (currentUser.role === 'agent') setActiveTab('agent');
                else setActiveTab('customer-tickets');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin' || activeTab === 'agent' || activeTab === 'customer-tickets'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100 hover:text-blue-800'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <>
                  <Crown className="w-3.5 h-3.5" />
                  Admin Panel
                  {pendingCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </>
              ) : currentUser.role === 'agent' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Agent Desk
                </>
              ) : (
                <>
                  <UserIcon className="w-3.5 h-3.5" />
                  My Tickets
                </>
              )}
            </button>
          )}

        </nav>

        {/* Zone 3: Primary Action (👤 Login / Active User Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 capitalize leading-tight">
                  {currentUser.role === 'admin' ? 'Single Admin' : currentUser.role === 'agent' ? 'Support Agent' : 'Customer'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-300" />
              <span>👤 Login</span>
            </button>
          )}

          {(!currentUser || currentUser.role === 'customer') && (
            <button
              onClick={onCreateTicketClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shadow-xs cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <span>+ New Ticket</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
