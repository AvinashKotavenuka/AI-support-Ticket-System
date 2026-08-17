/**
 * Database Layer & State Store
 * Implements full SQL schema equivalent in memory & LocalStorage
 * Stores: users, tickets, ticket_responses
 * User-defined custom passwords during registration + Single Admin policy & Agent ID approval workflow
 */

import { User, Ticket, TicketResponse, DashboardStats, TicketStatus, UserRole } from '../types';
import { runLocalNLP, runGroqNLP } from './nlpClassifier';

const USERS_STORAGE_KEY = 'ai_support_users_v4';
const TICKETS_STORAGE_KEY = 'ai_support_tickets_v4';
const RESPONSES_STORAGE_KEY = 'ai_support_responses_v4';
const AUTH_STORAGE_KEY = 'ai_support_current_user_v4';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'admin@support.com',
    password: 'adminPassword123',
    role: 'admin',
    department: 'System & User Administration',
    is_approved: true,
    created_at: '2026-08-10 09:00:00'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    email: 'sarah@support.com',
    password: 'sarahPassword123',
    role: 'agent',
    department: 'Technical & Billing Support',
    is_approved: true,
    created_at: '2026-08-11 10:15:00'
  },
  {
    id: 3,
    name: 'Michael Chang',
    email: 'michael@support.com',
    password: 'michaelPassword123',
    role: 'agent',
    department: 'Account & Delivery Desk',
    is_approved: true,
    created_at: '2026-08-11 11:30:00'
  },
  {
    id: 4,
    name: 'Dev Patel (Pending)',
    email: 'dev.agent@support.com',
    password: 'devPassword123',
    role: 'agent',
    department: 'Tier-1 Technical Support',
    is_approved: false,
    created_at: '2026-08-15 14:00:00'
  },
  {
    id: 5,
    name: 'Alex Rivera',
    email: 'alex@customer.com',
    password: 'alexPassword123',
    role: 'customer',
    department: 'Customer Self-Service',
    is_approved: true,
    created_at: '2026-08-12 14:20:00'
  },
  {
    id: 6,
    name: 'Priya Patel',
    email: 'priya@customer.com',
    password: 'priyaPassword123',
    role: 'customer',
    department: 'Customer Self-Service',
    is_approved: true,
    created_at: '2026-08-13 16:45:00'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 101,
    user_id: 5,
    customer_name: 'Alex Rivera',
    customer_email: 'alex@customer.com',
    title: 'Payment deducted twice but order still marked failed',
    description: 'My credit card was charged $129 twice for order #ORD-9932, but the web checkout displayed transaction failed. Please refund the duplicate amount and confirm my order ASAP!',
    category: 'Billing',
    priority: 'High',
    sentiment: 'Negative',
    status: 'Open',
    suggested_response: "We sincerely apologize for the billing issue you experienced. Our finance team is reviewing the transaction details right now and will assist with an immediate refund or credit confirmation within 24-48 hours.",
    assigned_agent: 2,
    assigned_agent_name: 'Sarah Jenkins',
    created_at: '2026-08-16 08:30:00',
    updated_at: '2026-08-16 09:15:00'
  },
  {
    id: 102,
    user_id: 5,
    customer_name: 'Alex Rivera',
    customer_email: 'alex@customer.com',
    title: 'Locked out of account, 2FA code not arriving',
    description: 'I entered my password correctly but the SMS 2FA verification token is not delivering to my registered phone number. I am completely locked out from our company dashboard.',
    category: 'Account',
    priority: 'High',
    sentiment: 'Negative',
    status: 'In Progress',
    suggested_response: "We recognize that you are locked out or experiencing authentication trouble. We have initiated a secure credential verification protocol to help you regain access safely.",
    assigned_agent: 3,
    assigned_agent_name: 'Michael Chang',
    created_at: '2026-08-16 07:10:00',
    updated_at: '2026-08-16 08:00:00'
  },
  {
    id: 103,
    user_id: 6,
    customer_name: 'Priya Patel',
    customer_email: 'priya@customer.com',
    title: '500 internal server error when generating monthly revenue report',
    description: 'Whenever I navigate to Analytics -> Export Monthly Breakdown, the loader spins for 30 seconds and then triggers a 500 error toast. Other exports work fine.',
    category: 'Technical',
    priority: 'Medium',
    sentiment: 'Negative',
    status: 'In Progress',
    suggested_response: "Thank you for reporting this technical bug. Our engineering team is reviewing the export worker logs and will roll out a patch shortly.",
    assigned_agent: 2,
    assigned_agent_name: 'Sarah Jenkins',
    created_at: '2026-08-15 11:20:00',
    updated_at: '2026-08-15 14:10:00'
  },
  {
    id: 104,
    user_id: 6,
    customer_name: 'Priya Patel',
    customer_email: 'priya@customer.com',
    title: 'Package marked delivered yesterday but not found in mailbox',
    description: 'Courier tracking #DLV-48201 states the package was delivered yesterday at 6 PM, but our building concierge has no record of it. Could you check with the courier company?',
    category: 'Delivery',
    priority: 'High',
    sentiment: 'Negative',
    status: 'Open',
    suggested_response: "We are sorry about the delivery discrepancy. We have opened a priority courier trace with our logistics partner and will update you within 4 hours.",
    assigned_agent: null,
    assigned_agent_name: null,
    created_at: '2026-08-16 09:00:00',
    updated_at: '2026-08-16 09:00:00'
  },
  {
    id: 105,
    user_id: 5,
    customer_name: 'Alex Rivera',
    customer_email: 'alex@customer.com',
    title: 'Inquiry regarding Enterprise volume discounts and SLA',
    description: 'Hello! Our team is expanding to 25 developers next quarter. Could you share enterprise tier pricing, SSO options, and SLA uptime guarantees?',
    category: 'Product',
    priority: 'Low',
    sentiment: 'Positive',
    status: 'Resolved',
    suggested_response: "Thank you for reaching out! Yes, we offer volume pricing for teams of 5 or more. We have attached the custom quote to your account.",
    assigned_agent: 2,
    assigned_agent_name: 'Sarah Jenkins',
    created_at: '2026-08-14 10:00:00',
    updated_at: '2026-08-15 10:00:00'
  },
  {
    id: 106,
    user_id: 6,
    customer_name: 'Priya Patel',
    customer_email: 'priya@customer.com',
    title: 'How do I download tax GST invoice for July 2026?',
    description: 'We require the formal GST receipt for tax filing. Where in the billing dashboard can our accounting department retrieve this?',
    category: 'Billing',
    priority: 'Low',
    sentiment: 'Neutral',
    status: 'Resolved',
    suggested_response: "Thank you for contacting billing support. We have verified your account information and will provide the requested tax/invoice documentation shortly.",
    assigned_agent: 3,
    assigned_agent_name: 'Michael Chang',
    created_at: '2026-08-13 15:10:00',
    updated_at: '2026-08-14 09:30:00'
  }
];

export const INITIAL_RESPONSES: TicketResponse[] = [
  {
    id: 1,
    ticket_id: 101,
    user_id: 2,
    user_name: 'Sarah Jenkins',
    user_role: 'agent',
    message: 'Hello Alex, I see the duplicate charge on our merchant portal. I have initiated a refund of $129 to your original card and confirmed order #ORD-9932.',
    is_internal_note: false,
    created_at: '2026-08-16 09:15:00'
  },
  {
    id: 2,
    ticket_id: 102,
    user_id: 3,
    user_name: 'Michael Chang',
    user_role: 'agent',
    message: 'Hi Alex, I have reset your SMS token count and verified your phone carrier connection. Please attempt login now.',
    is_internal_note: false,
    created_at: '2026-08-16 08:00:00'
  },
  {
    id: 3,
    ticket_id: 105,
    user_id: 2,
    user_name: 'Sarah Jenkins',
    user_role: 'agent',
    message: 'Hi Alex, I have sent the 25-seat Enterprise brochure and customized quote to your email. Feel free to schedule a demo call with our team anytime!',
    is_internal_note: false,
    created_at: '2026-08-15 10:00:00'
  }
];

export class DatabaseService {
  public static getUsers(): User[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  public static setUsers(users: User[]) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  public static getTickets(): Ticket[] {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TICKETS;
    }
  }

  public static setTickets(tickets: Ticket[]) {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  }

  public static getResponses(): TicketResponse[] {
    const raw = localStorage.getItem(RESPONSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(INITIAL_RESPONSES));
      return INITIAL_RESPONSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_RESPONSES;
    }
  }

  public static setResponses(responses: TicketResponse[]) {
    localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(responses));
  }

  // Auth Operations - Nullable to support initial guest/unauthenticated state
  public static getCurrentUser(): User | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id) return parsed;
      } catch {
        // ignore
      }
    }
    return null;
  }

  public static setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  public static logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  public static getAllAgents(): User[] {
    return this.getUsers().filter(u => u.role === 'agent' && u.is_approved !== false);
  }

  public static getPendingAgents(): User[] {
    return this.getUsers().filter(u => u.role === 'agent' && u.is_approved === false);
  }

  // Admin Agent Approval Operations
  public static approveAgent(agentId: number): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === agentId && u.role === 'agent');
    if (index !== -1) {
      users[index].is_approved = true;
      this.setUsers(users);
      return true;
    }
    return false;
  }

  public static revokeAgent(agentId: number): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === agentId && u.role === 'agent');
    if (index !== -1) {
      users[index].is_approved = false;
      this.setUsers(users);
      return true;
    }
    return false;
  }

  public static registerUser(
    name: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    department: string
  ): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Only 1 admin allowed
    if (role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount >= 1) {
        return { success: false, error: 'Administrative restriction: Only one Admin account is allowed in the system.' };
      }
    }

    const isApproved = role !== 'agent'; // Agents require admin approval
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // user's own chosen password
      role,
      department: department || (role === 'customer' ? 'Customer Self-Service' : 'Support Desk'),
      is_approved: isApproved,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    users.push(newUser);
    this.setUsers(users);

    return { success: true, user: newUser };
  }

  // Ticket CRUD Operations
  public static async createTicket(
    title: string,
    description: string,
    user: User,
    useGroq: boolean = false
  ): Promise<Ticket> {
    const tickets = this.getTickets();

    // 1. Run Machine Learning / NLP Pipeline
    const mlResult = useGroq
      ? await runGroqNLP(title, description)
      : runLocalNLP(title, description);

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 101;

    const newTicket: Ticket = {
      id: newId,
      user_id: user.id,
      customer_name: user.name,
      customer_email: user.email,
      title,
      description,
      category: mlResult.category,
      priority: mlResult.priority,
      sentiment: mlResult.sentiment,
      status: 'Open',
      suggested_response: mlResult.suggested_response,
      assigned_agent: null,
      assigned_agent_name: null,
      created_at: now,
      updated_at: now
    };

    tickets.unshift(newTicket);
    this.setTickets(tickets);
    return newTicket;
  }

  public static getTicketById(id: number): Ticket | null {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return null;

    const responses = this.getResponses().filter(r => r.ticket_id === id);
    return {
      ...ticket,
      responses
    };
  }

  public static updateTicketStatus(id: number, status: TicketStatus): Ticket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;

    tickets[index].status = status;
    tickets[index].updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.setTickets(tickets);
    return tickets[index];
  }

  public static assignAgent(ticketId: number, agentId: number | null): Ticket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) return null;

    const agents = this.getAllAgents();
    const assigned = agents.find(a => a.id === agentId);

    tickets[index].assigned_agent = agentId;
    tickets[index].assigned_agent_name = assigned ? assigned.name : null;
    tickets[index].updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (tickets[index].status === 'Open' && agentId !== null) {
      tickets[index].status = 'In Progress';
    }

    this.setTickets(tickets);
    return tickets[index];
  }

  public static addResponse(
    ticketId: number,
    userId: number,
    message: string,
    isInternalNote: boolean = false
  ): TicketResponse {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId) || users[0];
    const responses = this.getResponses();

    const newResponse: TicketResponse = {
      id: responses.length > 0 ? Math.max(...responses.map(r => r.id)) + 1 : 1,
      ticket_id: ticketId,
      user_id: user.id,
      user_name: user.name,
      user_role: user.role,
      message,
      is_internal_note: isInternalNote,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    responses.push(newResponse);
    this.setResponses(responses);

    if (user.role === 'agent' || user.role === 'admin') {
      const tickets = this.getTickets();
      const tIdx = tickets.findIndex(t => t.id === ticketId);
      if (tIdx !== -1 && tickets[tIdx].status === 'Open') {
        tickets[tIdx].status = 'In Progress';
        tickets[tIdx].updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
        this.setTickets(tickets);
      }
    }

    return newResponse;
  }

  public static getDashboardStats(): DashboardStats {
    const tickets = this.getTickets();

    const total_tickets = tickets.length;
    const open_tickets = tickets.filter(t => t.status === 'Open').length;
    const in_progress_tickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolved_tickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const high_priority_tickets = tickets.filter(t => t.priority === 'High').length;

    const catMap: Record<string, number> = {};
    const prioMap: Record<string, number> = {};
    const sentMap: Record<string, number> = {};
    const statMap: Record<string, number> = {};

    tickets.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + 1;
      prioMap[t.priority] = (prioMap[t.priority] || 0) + 1;
      sentMap[t.sentiment] = (sentMap[t.sentiment] || 0) + 1;
      statMap[t.status] = (statMap[t.status] || 0) + 1;
    });

    return {
      total_tickets,
      open_tickets,
      in_progress_tickets,
      resolved_tickets,
      high_priority_tickets,
      category_distribution: Object.entries(catMap).map(([name, count]) => ({ name, count })),
      priority_distribution: Object.entries(prioMap).map(([name, count]) => ({ name, count })),
      sentiment_distribution: Object.entries(sentMap).map(([name, count]) => ({ name, count })),
      status_distribution: Object.entries(statMap).map(([name, count]) => ({ name, count }))
    };
  }

  public static resetToDefaultSeed() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(INITIAL_RESPONSES));
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
