import { describe, expect, it } from 'vitest';
import { ChatEngine } from '@/engine/chat-engine';
import type { ChatApiClient } from '@/api/client';
import type { ChatApiConfig } from '@/types/config';

const config: ChatApiConfig = {
  apiBaseUrl: 'https://api.example.com',
  token: 'token',
  agentId: 'agent-id',
  agentName: 'agent-name',
  user: 'test-user',
  workflowId: 'workflow-id'
};

describe('ChatEngine', () => {
  it('sends and parses message', async () => {
    const client: ChatApiClient = {
      sendMessage: async () => ({
        answer: '{"summary":"hello"}',
        conversation_id: 'cid-1'
      })
    };
    const engine = new ChatEngine(client, config);
    const result = await engine.sendMessage('hi');
    expect(result.userMessage.role).toBe('user');
    expect(result.aiMessage.structured?.summary).toBe('hello');
    expect(engine.getConversationId()).toBe('cid-1');
  });
});
