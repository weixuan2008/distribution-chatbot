import { inject } from 'vue';
import type { ChatEngine } from '@/engine/chat-engine';

export const CHAT_ENGINE_KEY = Symbol('chat-engine');

export function useChatEngine(): ChatEngine {
  const engine = inject<ChatEngine>(CHAT_ENGINE_KEY);
  if (!engine) {
    throw new Error('ChatEngine not provided');
  }
  return engine;
}
