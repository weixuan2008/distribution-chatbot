import { defineStore } from 'pinia';
import { createId } from '@/utils/id';
import type { ChatMessage, ChatUsageMetadata } from '@/types/chat';
import type { ChatEngine } from '@/engine/chat-engine';

export interface ChatState {
  messages: ChatMessage[];
  conversationId?: string;
  sending: boolean;
  error?: string;
  usageMetadata?: ChatUsageMetadata;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    conversationId: undefined,
    sending: false,
    error: undefined,
    usageMetadata: undefined
  }),
  actions: {
    setConversationId(id?: string) {
      this.conversationId = id;
    },
    reset() {
      this.messages = [];
      this.error = undefined;
      this.sending = false;
      this.usageMetadata = undefined;
      this.conversationId = undefined;
    },
    async send(engine: ChatEngine, query: string) {
      this.sending = true;
      this.error = undefined;
      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        text: query,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      this.messages.push(userMessage);
      try {
        const { aiMessage } = await engine.sendMessage(query);
        this.messages.push(aiMessage);
        this.conversationId = engine.getConversationId();
        this.usageMetadata = (aiMessage.metadata?.usage as ChatUsageMetadata | undefined) ?? {};
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to send message';
        this.messages.push({
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: this.error,
          timestamp: new Date().toISOString(),
          status: 'error',
          metadata: {
            retryQuery: query
          }
        });
      } finally {
        this.sending = false;
      }
    },
    async retry(engine: ChatEngine, message: ChatMessage) {
      this.sending = true;
      this.error = undefined;
      try {
        const retryQuery =
          (typeof message.metadata?.retryQuery === 'string' && message.metadata.retryQuery) || message.text;
        const { aiMessage } = await engine.sendMessage(retryQuery);
        this.messages.push(aiMessage);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to retry message';
      } finally {
        this.sending = false;
      }
    }
  }
});
