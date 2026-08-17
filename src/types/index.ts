export type UserRole = 'customer' | 'agent' | 'admin';

export type TicketCategory = 'Billing' | 'Technical' | 'Account' | 'Product' | 'Delivery' | 'General';

export type TicketPriority = 'Low' | 'Medium' | 'High';

export type TicketSentiment = 'Positive' | 'Neutral' | 'Negative';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  is_approved?: boolean;
  created_at: string;
}

export interface TicketResponse {
  id: number;
  ticket_id: number;
  user_id: number;
  user_name: string;
  user_role: UserRole;
  message: string;
  is_internal_note: boolean;
  created_at: string;
}

export interface Ticket {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  status: TicketStatus;
  suggested_response?: string;
  assigned_agent?: number | null;
  assigned_agent_name?: string | null;
  created_at: string;
  updated_at: string;
  responses?: TicketResponse[];
}

export interface NLPClassificationResult {
  category: TicketCategory;
  priority: TicketPriority;
  sentiment: TicketSentiment;
  suggested_response: string;
  confidence_score: number;
  tokens: string[];
  tfidf_top_features: { feature: string; weight: number }[];
  model_source: 'Local Scikit-Learn TF-IDF' | 'Groq Llama 3.3 70B' | 'Gemini 2.5 Flash';
}

export interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  high_priority_tickets: number;
  category_distribution: { name: string; count: number }[];
  priority_distribution: { name: string; count: number }[];
  sentiment_distribution: { name: string; count: number }[];
  status_distribution: { name: string; count: number }[];
}
