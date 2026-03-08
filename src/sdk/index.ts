import type { App as VueApp, Plugin } from 'vue';
import ChatbotWidget from '@/components/ChatbotWidget.vue';
import { createChatbotWidgetApp } from '@/app/create-widget-app';
import type { ChatbotRuntimeConfig } from '@/types/config';
import { registerPlugin, registerRenderer } from '@/sdk/runtime';
import { createChatApiClient } from '@/api/client';
import { ChatEngine } from '@/engine/chat-engine';
import { resolveApiConfig } from '@/utils/config';

export { ChatbotWidget, registerRenderer, registerPlugin };
export type { ChatbotRuntimeConfig };
export { ChatEngine };
export * from '@/sdk/plugins';

export function createChatEngine(config: ChatbotRuntimeConfig): ChatEngine {
  const apiConfig = resolveApiConfig(config);
  const client = createChatApiClient(apiConfig);
  return new ChatEngine(client, apiConfig, apiConfig.conversationId);
}

export function mountChatbot(options: { el: string | HTMLElement; config: ChatbotRuntimeConfig }) {
  const { app, engine } = createChatbotWidgetApp(options.config);
  const target =
    typeof options.el === 'string' ? document.querySelector(options.el) : (options.el as HTMLElement);
  if (!target) {
    throw new Error('Mount target not found');
  }
  app.mount(target);
  return { app, engine };
}

export function createChatbotPlugin(defaultConfig: ChatbotRuntimeConfig = {}): Plugin {
  return {
    install(app: VueApp, runtimeConfig?: ChatbotRuntimeConfig) {
      const merged = { ...defaultConfig, ...(runtimeConfig ?? {}) };
      const widget = createChatbotWidgetApp(merged);
      app.component('ChatbotWidget', ChatbotWidget);
      app.provide('chatbotEngine', widget.engine);
    }
  };
}
