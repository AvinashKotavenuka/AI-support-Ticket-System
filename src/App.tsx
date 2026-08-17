import React, { useState } from 'react';
import { Ticket, User, TicketStatus } from './types';
import { DatabaseService } from './services/database';
import { Navbar } from './components/Navbar';
import { CustomerPortal } from './pages/customer/CustomerPortal';
import { AgentWorkspace } from './pages/agent/AgentWorkspace';
import { AdminPanel } from './pages/admin/AdminPanel';
import { AuthModal } from './pages/auth/AuthModal';
import { HowItWorks } from './pages/public/HowItWorks';
import { ContactPage } from './pages/public/ContactPage';
import { CreateTicketModal } from './components/CreateTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => DatabaseService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => DatabaseService.getUsers());
  const [tickets, setTickets] = useState<Ticket[]>(() => DatabaseService.getTickets());
  const [responses, setResponses] = useState(() => DatabaseService.getResponses());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authActionMessage, setAuthActionMessage] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state whenever database changes
  const refreshData = () => {
    setUsers(DatabaseService.getUsers());
    setTickets(DatabaseService.getTickets());
    setResponses(DatabaseService.getResponses());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    DatabaseService.logout();
    setCurrentUser(null);
    setActiveTab('home');
    showToast('You have been signed out.');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshData();
    showToast(`Logged in successfully as ${user.name} (${user.role.toUpperCase()})`);
    
    // Direct routing based on role
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'agent') {
      setActiveTab('agent');
    } else {
      setActiveTab('home');
    }
  };

  // Intercept ticket creation: If not logged in, prompt login first
  const handleOpenCreateTicket = () => {
    if (!currentUser) {
      setAuthActionMessage('Please sign in or register as a customer to create and submit a support ticket.');
      setIsAuthOpen(true);
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateTicket = async (title: string, description: string, useGroq: boolean) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const created = await DatabaseService.createTicket(title, description, currentUser, useGroq);
    refreshData();
    showToast(`Ticket #${created.id} created & auto-classified as [${created.category}] with [${created.priority}] priority.`);
  };

  const handleOpenTicket = (ticket: Ticket) => {
    const full = DatabaseService.getTicketById(ticket.id);
    setSelectedTicket(full || ticket);
  };

  const handleUpdateStatus = (ticketId: number, status: TicketStatus) => {
    DatabaseService.updateTicketStatus(ticketId, status);
    refreshData();
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(DatabaseService.getTicketById(ticketId));
    }
    showToast(`Ticket #${ticketId} status updated to ${status}.`);
  };

  const handleAssignAgent = (ticketId: number, agentId: number | null) => {
    DatabaseService.assignAgent(ticketId, agentId);
    refreshData();
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(DatabaseService.getTicketById(ticketId));
    }
    const agent = users.find((u) => u.id === agentId);
    showToast(agentId ? `Ticket #${ticketId} assigned to ${agent?.name}.` : `Ticket #${ticketId} unassigned.`);
  };

  const handleAddResponse = (ticketId: number, message: string, isInternal: boolean) => {
    if (!currentUser) return;
    DatabaseService.addResponse(ticketId, currentUser.id, message, isInternal);
    refreshData();
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(DatabaseService.getTicketById(ticketId));
    }
    showToast(isInternal ? 'Internal note added.' : 'Response sent to customer.');
  };

  const handleResetData = () => {
    DatabaseService.resetToDefaultSeed();
    setUsers(DatabaseService.getUsers());
    setTickets(DatabaseService.getTickets());
    setResponses(DatabaseService.getResponses());
    setCurrentUser(null);
    setActiveTab('home');
    showToast('Database reset to initial records. Signed out.');
  };

  const allAgents = users.filter((u) => u.role === 'agent' && u.is_approved !== false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Clean Header: [AI Support] --- [Home, How It Works, Contact, (Role tab)] --- [👤 Login / User] */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        users={users}
        onCreateTicketClick={handleOpenCreateTicket}
        onOpenAuthModal={() => {
          setAuthActionMessage(undefined);
          setIsAuthOpen(true);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-white border border-slate-200 text-slate-800 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        
        {/* 1. Home / Helpdesk */}
        {(activeTab === 'home' || activeTab === 'customer-tickets') && (
          <CustomerPortal
            currentUser={currentUser}
            tickets={tickets}
            onOpenTicket={(ticket) => {
              if (!currentUser) {
                setAuthActionMessage('Please sign in with your customer credentials to view ticket details.');
                setIsAuthOpen(true);
              } else {
                handleOpenTicket(ticket);
              }
            }}
            onCreateTicketClick={handleOpenCreateTicket}
            onOpenAuthModal={() => {
              setAuthActionMessage(undefined);
              setIsAuthOpen(true);
            }}
          />
        )}

        {/* 2. How It Works */}
        {activeTab === 'how-it-works' && (
          <HowItWorks
            onOpenCreateTicket={handleOpenCreateTicket}
            onOpenAuthModal={() => {
              setAuthActionMessage(undefined);
              setIsAuthOpen(true);
            }}
          />
        )}

        {/* 3. Contact */}
        {activeTab === 'contact' && (
          <ContactPage />
        )}

        {/* 4. Agent Desk */}
        {activeTab === 'agent' && (
          !currentUser || currentUser.role !== 'agent' ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center max-w-md mx-auto my-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Agent Authentication Required</h2>
              <p className="text-xs text-slate-500">
                The Agent Workspace is reserved for approved support personnel. Please sign in with your agent credentials.
              </p>
              <button
                onClick={() => {
                  setAuthActionMessage('Sign in as an approved Support Agent to access the triage desk.');
                  setIsAuthOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign In as Agent
              </button>
            </div>
          ) : currentUser.is_approved === false ? (
            // Pending Agent ID Verification Gate
            <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-xs text-center max-w-lg mx-auto my-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Agent ID #{currentUser.id} Pending Approval</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Your agent registration has been recorded. However, access to the Support Agent Desk requires explicit verification and approval by the <strong>Single System Administrator</strong>.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1 font-mono text-slate-700">
                <div><strong>Name:</strong> {currentUser.name}</div>
                <div><strong>Email:</strong> {currentUser.email}</div>
                <div><strong>Role:</strong> Agent (Pending ID Verification)</div>
                <div><strong>Department:</strong> {currentUser.department}</div>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => {
                    setAuthActionMessage('Sign in as Admin to approve pending Agent IDs.');
                    setIsAuthOpen(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsAuthOpen(true);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Switch Account
                </button>
              </div>
            </div>
          ) : (
            <AgentWorkspace
              currentUser={currentUser}
              tickets={tickets}
              allAgents={allAgents}
              onOpenTicket={handleOpenTicket}
              onUpdateStatus={handleUpdateStatus}
              onAssignAgent={handleAssignAgent}
            />
          )
        )}

        {/* 5. Admin Panel */}
        {activeTab === 'admin' && (
          !currentUser || currentUser.role !== 'admin' ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center max-w-md mx-auto my-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Administrator Access Only</h2>
              <p className="text-xs text-slate-500">
                Only the Single System Administrator can access this console to manage accounts and approve Agent IDs.
              </p>
              <button
                onClick={() => {
                  setAuthActionMessage('Sign in as Admin (admin@support.com) to access the governance console.');
                  setIsAuthOpen(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          ) : (
            <AdminPanel
              currentUser={currentUser}
              allUsers={users}
              tickets={tickets}
              onUserUpdate={refreshData}
              onOpenTicket={handleOpenTicket}
            />
          )
        )}

      </main>

      {/* Role-Based Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthActionMessage(undefined);
        }}
        onLoginSuccess={handleLoginSuccess}
        allUsers={users}
        initialActionMessage={authActionMessage}
      />

      {/* Create Ticket Modal */}
      {currentUser && (
        <CreateTicketModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateTicket}
          currentUser={currentUser}
        />
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        currentUser={currentUser || {
          id: 0,
          name: 'Guest Visitor',
          email: 'guest@visitor.com',
          role: 'customer',
          department: 'Guest',
          is_approved: true,
          created_at: ''
        }}
        allAgents={allAgents}
        onUpdateStatus={handleUpdateStatus}
        onAssignAgent={handleAssignAgent}
        onAddResponse={handleAddResponse}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Support • Smart NLP Ticket Classification & Resolution System</span>
          <span className="font-mono text-[11px] text-slate-600">
            {currentUser ? `Signed in as: ${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Status: Guest Visitor'}
          </span>
        </div>
      </footer>

    </div>
  );
}
