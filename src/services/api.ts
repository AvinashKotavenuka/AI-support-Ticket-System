/**
 * REST API Client Layer
 * Handles communication with Node.js & Express REST API
 * Supports JWT authentication token headers
 */

import { User, Ticket, TicketResponse, DashboardStats, TicketStatus } from '../types';
import { DatabaseService, INITIAL_USERS } from './database';

const API_BASE_URL = '/api';
const TOKEN_KEY = 'ai_support_jwt_token';

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public static setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public static clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  private static getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Auth: Login
  public static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) this.setToken(data.token);
        if (data.user) DatabaseService.setCurrentUser(data.user);
        return { user: data.user, token: data.token };
      }
    } catch {
      // Backend not running in dev preview - fallback to local database
    }

    // Fallback simulation
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_USERS[3];
    const mockToken = `jwt_mock_${found.id}_${Date.now()}`;
    this.setToken(mockToken);
    DatabaseService.setCurrentUser(found);
    return { user: found, token: mockToken };
  }

  // Tickets: Get All
  public static async getTickets(params?: Record<string, string>): Promise<Ticket[]> {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/tickets${query}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.tickets || [];
      }
    } catch {
      // fallback to database service
    }
    return DatabaseService.getTickets();
  }

  // Tickets: Create Ticket
  public static async createTicket(title: string, description: string, user: User, useGroq: boolean = false): Promise<Ticket> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ title, description, useGroq })
      });
      if (res.ok) {
        const data = await res.json();
        return data.ticket;
      }
    } catch {
      // fallback
    }
    return await DatabaseService.createTicket(title, description, user, useGroq);
  }

  // Tickets: Update Status
  public static async updateStatus(ticketId: number, status: TicketStatus): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    DatabaseService.updateTicketStatus(ticketId, status);
    return true;
  }

  // Tickets: Assign Agent
  public static async assignAgent(ticketId: number, agentId: number | null): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ agent_id: agentId })
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    DatabaseService.assignAgent(ticketId, agentId);
    return true;
  }

  // Tickets: Add Response / Note
  public static async addResponse(ticketId: number, userId: number, message: string, isInternal: boolean): Promise<TicketResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message, is_internal_note: isInternal })
      });
      if (res.ok) {
        const data = await res.json();
        return data.response;
      }
    } catch {
      // fallback
    }
    return DatabaseService.addResponse(ticketId, userId, message, isInternal);
  }

  // Analytics: Get Stats
  public static async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.stats;
      }
    } catch {
      // fallback
    }
    return DatabaseService.getDashboardStats();
  }
}
