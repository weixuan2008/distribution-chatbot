export interface ChatMessagesRequest {
  inputs: {
    agent_id: string;
    agent_name: string;
  };
  query: string;
  response_mode: 'blocking';
  conversation_id?: string;
  user: string;
  workflow_id: string;
}

export interface ChatMessagesResponse {
  answer?: string;
  conversation_id?: string;
  metadata?: Record<string, unknown>;
  usage?: Record<string, unknown>;
  [key: string]: unknown;
}
