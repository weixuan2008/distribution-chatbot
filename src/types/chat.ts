export type Role = 'user' | 'assistant' | 'system';

export interface Contact {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  birth?: string;
  occupation?: string;
  [key: string]: unknown;
}

export interface ProductItem {
  id?: string;
  name?: string;
  price?: string | number;
  description?: string;
  [key: string]: unknown;
}

export interface QuotationItem {
  id?: string;
  title?: string;
  amount?: string | number;
  [key: string]: unknown;
}

export interface ChatStructuredData {
  summary?: string;
  contact_list?: Contact[];
  product_list?: ProductItem[];
  quotation_list?: QuotationItem[];
  report_list?: unknown[];
  [key: string]: unknown;
}

export interface ParsedResponsePayload {
  text: string;
  structured: ChatStructuredData;
  raw: unknown;
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
  status?: 'pending' | 'sent' | 'error';
  rendererType?: string;
  structured?: ChatStructuredData;
  metadata?: Record<string, unknown>;
}

export interface ChatUsageMetadata {
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  [key: string]: unknown;
}
