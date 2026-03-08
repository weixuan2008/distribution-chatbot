export interface ChatApiConfig {
  apiBaseUrl: string;
  token: string;
  agentId: string;
  agentName: string;
  user: string;
  workflowId: string;
  conversationId?: string;
}

export interface RuntimeUiConfig {
  locale?: string;
  theme?: 'light' | 'dark' | string;
  width?: string;
  height?: string;
  welcomeMessage?: string;
}

export interface ChatbotRuntimeConfig extends Partial<ChatApiConfig>, RuntimeUiConfig {}
