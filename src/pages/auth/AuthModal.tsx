import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { DatabaseService } from '../../services/database';
import { 
  LogIn, UserPlus, ShieldAlert, CheckCircle2, Lock, Mail, 
  Sparkles, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Crown, 
  User as UserIcon, Eye, EyeOff 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  allUsers: User[];
  defaultRole?: 'customer' | 'agent' | 'admin';
  initialActionMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  allUsers,
  defaultRole = 'customer',
  initialActionMessage
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'customer' | 'agent' | 'admin'>(defaultRole);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Technical & Billing Support');
  const [showPassword, setShowPassword] = useState(false);
  
  // State feedback
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  // Single admin check
  const adminExists = allUsers.some(u => u.role === 'admin');

  const handleQuickFill = (user: User) => {
    setEmail(user.email);
    setPassword(user.password || 'password123');
    setError(null);
    setSuccessInfo(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    const users = DatabaseService.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      setError('User not found with this email. Please check your credentials or register below.');
      return;
    }

    // Check password if set
    if (found.password && found.password !== password) {
      setError('Incorrect password. Please verify the password you registered with.');
      return;
    }

    // Role Approval Check: If Agent, must be approved by Admin
    if (found.role === 'agent' && !found.is_approved) {
      setError(`⚠️ Access Denied: Agent ID #${found.id} (${found.name}) is currently PENDING approval from the System Administrator. Please contact the Admin to approve your Agent ID.`);
      return;
    }

    DatabaseService.setCurrentUser(found);
    onLoginSuccess(found);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (!name.trim() || !email.trim()) {
      setError('Please fill in both full name and email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please choose a secure password with at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter both passwords carefully.');
      return;
    }

    // Single Admin restriction policy
    if (role === 'admin' && adminExists) {
      setError('Administrative Policy: Only 1 Admin account is allowed in the entire system. Please sign in as the existing Admin or register as Customer/Agent.');
      return;
    }

    const result = DatabaseService.registerUser(name, email, password, role, department);
    if (!result.success || !result.user) {
      setError(result.error || 'Failed to create user account.');
      return;
    }

    if (result.user.role === 'agent') {
      // Agent is created as is_approved = false
      setSuccessInfo(`Agent registered successfully with Agent ID #${result.user.id}. Your profile is currently PENDING Admin approval before you can access the Agent Desk.`);
      setMode('login');
      setEmail(result.user.email);
    } else {
      // Customer or Admin gets instant access
      DatabaseService.setCurrentUser(result.user);
      onLoginSuccess(result.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                AI
              </div>
              <span className="font-bold text-sm tracking-wide">SupportMatrix Authentication</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>
          <h2 className="text-xl font-bold mt-3">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create a New Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {initialActionMessage || 'Role-Based Access: Customer Instant Access | Agent Verification | Single Admin.'}
          </p>
        </div>

        {/* Tab Switcher: Login / Register */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccessInfo(null); }}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              mode === 'login'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); setSuccessInfo(null); }}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              mode === 'register'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Registration</span>
          </button>
        </div>

        {/* Quick Demo Fill Accounts */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-700">1-Click Test Profiles:</span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill(allUsers.find(u => u.role === 'customer') || allUsers[4])}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 text-left transition-colors cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                <UserIcon className="w-3 h-3" />
                Customer
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">alex@customer.com</div>
              <div className="text-[9px] text-emerald-600 font-medium">Customer View</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill(allUsers.find(u => u.role === 'agent' && u.is_approved) || allUsers[1])}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-500 text-left transition-colors cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Approved Agent
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">sarah@support.com</div>
              <div className="text-[9px] text-blue-600 font-medium">Agent Desk</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill(allUsers.find(u => u.role === 'admin') || allUsers[0])}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:border-purple-500 text-left transition-colors cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700">
                <Crown className="w-3 h-3 text-purple-600" />
                Single Admin
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">admin@support.com</div>
              <div className="text-[9px] text-purple-600 font-medium">Admin Panel</div>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successInfo}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Role to Register
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                      role === 'customer'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">Customer</div>
                    <div className="text-[10px] text-slate-500">Instant access to submit & track tickets</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('agent')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                      role === 'agent'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span>Support Agent</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-mono">Requires ID Approval</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Requires Admin approval before desk access</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@support.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Choose Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {role === 'agent' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Specialty
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Technical & Billing Support">Technical & Billing Support</option>
                    <option value="Account & Delivery Desk">Account & Delivery Desk</option>
                    <option value="Tier-1 Technical Support">Tier-1 Technical Support</option>
                    <option value="Logistics Operations">Logistics Operations</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Register & Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
