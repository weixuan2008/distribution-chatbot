import { createId } from '@/utils/id';
import { safeParseAnswer } from '@/utils/parser';
import type { ChatMessage, ParsedResponsePayload } from '@/types/chat';
import type { ChatApiConfig } from '@/types/config';
import type { ChatMessagesRequest } from '@/types/api';
import type { ChatApiClient } from '@/api/client';

type ChatEngineEvents = {
  messageSent: ChatMessage;
  messageReceived: ChatMessage;
  error: Error;
  reset: void;
};

type Handler<T> = (payload: T) => void;

export class ChatEngine {
  private readonly listeners: { [K in keyof ChatEngineEvents]?: Handler<ChatEngineEvents[K]>[] } =
    {};

  public constructor(
    private readonly apiClient: ChatApiClient,
    private readonly config: ChatApiConfig,
    private conversationId?: string
  ) {
    this.conversationId = conversationId ?? config.conversationId;
  }

  public on<K extends keyof ChatEngineEvents>(event: K, handler: Handler<ChatEngineEvents[K]>): void {
    this.listeners[event] = this.listeners[event] ?? [];
    this.listeners[event]?.push(handler);
  }

  public emit<K extends keyof ChatEngineEvents>(event: K, payload: ChatEngineEvents[K]): void {
    this.listeners[event]?.forEach((handler) => handler(payload));
  }

  public async sendMessage(query: string): Promise<{ userMessage: ChatMessage; aiMessage: ChatMessage }> {
    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      text: query,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    this.emit('messageSent', userMessage);

    const payload: ChatMessagesRequest = {
      inputs: {
        agent_id: this.config.agentId,
        agent_name: this.config.agentName
      },
      query,
      response_mode: 'blocking',
      conversation_id: this.conversationId,
      user: this.config.user,
      workflow_id: this.config.workflowId
    };

    try {
      const response = await this.apiClient.sendMessage(payload);
      this.conversationId = response.conversation_id ?? this.conversationId;
      const parsed = this.parseResponse(response.answer);
      const aiMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        text: parsed.text,
        timestamp: new Date().toISOString(),
        status: 'sent',
        structured: parsed.structured,
        metadata: {
          raw: parsed.raw,
          usage: response.usage ?? {}
        }
      };
      this.emit('messageReceived', aiMessage);
      return { userMessage, aiMessage };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.emit('error', err);
      throw err;
    }
  }

  public async retryMessage(message: ChatMessage): Promise<{ userMessage: ChatMessage; aiMessage: ChatMessage }> {
    return this.sendMessage(message.text);
  }

  public resetConversation(): void {
    this.conversationId = undefined;
    this.emit('reset', undefined);
  }

  public parseResponse(answer?: string): ParsedResponsePayload {
    return safeParseAnswer(answer);
  }

  public getConversationId(): string | undefined {
    return this.conversationId;
  }
}
