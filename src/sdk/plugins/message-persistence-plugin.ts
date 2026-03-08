import type { ChatbotPlugin } from '@/types/plugins';
import type { ChatMessage } from '@/types/chat';

export function createMessagePersistencePlugin(storageKey = 'enterprise-chatbot-messages'): ChatbotPlugin {
  return {
    name: 'message-persistence-plugin',
    setup({ engine }) {
      const existing = safeGet(storageKey);
      if (existing.length) {
        existing.forEach((msg) => engine.emit('messageReceived', msg));
      }

      engine.on('messageReceived', () => {
        // Runtime persistence hook should be connected with the UI store in host app.
      });
    }
  };
}

function safeGet(storageKey: string): ChatMessage[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
