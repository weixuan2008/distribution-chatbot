import type { ChatbotPlugin } from '@/types/plugins';

export function createAnalyticsPlugin(
  track: (eventName: string, payload: Record<string, unknown>) => void
): ChatbotPlugin {
  return {
    name: 'analytics-plugin',
    setup({ engine }) {
      engine.on('messageSent', (message) => track('chat_message_sent', { role: message.role }));
      engine.on('messageReceived', (message) =>
        track('chat_message_received', { role: message.role, hasStructured: !!message.structured })
      );
      engine.on('error', (error) => track('chat_error', { message: error.message }));
    }
  };
}
