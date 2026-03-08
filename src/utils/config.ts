import type { ChatApiConfig, ChatbotRuntimeConfig, RuntimeUiConfig } from '@/types/config';

function getEnv() {
  return import.meta.env;
}

export function resolveApiConfig(runtimeConfig: ChatbotRuntimeConfig): ChatApiConfig {
  const env = getEnv();
  return {
    apiBaseUrl: runtimeConfig.apiBaseUrl ?? env.VITE_CHATBOT_API_BASE_URL ?? '',
    token: runtimeConfig.token ?? env.VITE_CHATBOT_TOKEN ?? '',
    agentId: runtimeConfig.agentId ?? env.VITE_CHATBOT_AGENT_ID ?? '',
    agentName: runtimeConfig.agentName ?? env.VITE_CHATBOT_AGENT_NAME ?? '',
    user: runtimeConfig.user ?? env.VITE_CHATBOT_USER ?? 'anonymous',
    workflowId: runtimeConfig.workflowId ?? env.VITE_CHATBOT_WORKFLOW_ID ?? '',
    conversationId: runtimeConfig.conversationId ?? env.VITE_CHATBOT_CONVERSATION_ID
  };
}

export function resolveUiConfig(
  runtimeConfig: ChatbotRuntimeConfig
): RuntimeUiConfig & Required<Pick<RuntimeUiConfig, 'locale' | 'theme' | 'welcomeMessage'>> {
  const env = getEnv();
  return {
    locale: runtimeConfig.locale ?? env.VITE_CHATBOT_LOCALE ?? 'en-US',
    theme: runtimeConfig.theme ?? env.VITE_CHATBOT_THEME ?? 'light',
    width: runtimeConfig.width,
    height: runtimeConfig.height,
    welcomeMessage:
      runtimeConfig.welcomeMessage ??
      env.VITE_CHATBOT_WELCOME_MESSAGE ??
      'Hello, how can I help you today?'
  };
}
