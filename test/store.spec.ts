import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useChatStore } from '@/stores/chat-store';
import type { ChatEngine } from '@/engine/chat-engine';

describe('chat-store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates messages after sending', async () => {
    const store = useChatStore();
    const engine = {
      sendMessage: async (query: string) => ({
        userMessage: {
          id: 'u1',
          role: 'user',
          text: query,
          timestamp: new Date().toISOString(),
          status: 'sent'
        },
        aiMessage: {
          id: 'a1',
          role: 'assistant',
          text: 'hello',
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
      }),
      getConversationId: () => 'cid'
    } as unknown as ChatEngine;

    await store.send(engine, 'hello');
    expect(store.messages).toHaveLength(2);
    expect(store.conversationId).toBe('cid');
  });
});
