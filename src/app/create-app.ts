import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import type { ChatbotRuntimeConfig } from '@/types/config';
import { resolveApiConfig, resolveUiConfig } from '@/utils/config';
import { createChatApiClient } from '@/api/client';
import { ChatEngine } from '@/engine/chat-engine';
import { CHAT_ENGINE_KEY } from '@/composables/use-chat-engine';
import { initDefaultRenderers } from '@/renderers/defaults';
import { useConfigStore } from '@/stores/config-store';
import { createI18nInstance } from '@/i18n';
import { router } from '@/router';
import App from '@/App.vue';

import 'quasar/src/css/index.sass';
import '@/css/app.scss';

export function createChatbotApp(runtimeConfig: ChatbotRuntimeConfig = {}): {
  app: VueApp;
  engine: ChatEngine;
} {
  const pinia = createPinia();
  const apiConfig = resolveApiConfig(runtimeConfig);
  const uiConfig = resolveUiConfig(runtimeConfig);
  const apiClient = createChatApiClient(apiConfig);
  const engine = new ChatEngine(apiClient, apiConfig, apiConfig.conversationId);
  const i18n = createI18nInstance(uiConfig.locale);

  initDefaultRenderers();

  const app = createApp(App);
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.use(Quasar, {});
  app.provide(CHAT_ENGINE_KEY, engine);

  const configStore = useConfigStore(pinia);
  configStore.setApiConfig(apiConfig);
  configStore.setLocale(uiConfig.locale);
  configStore.setTheme(uiConfig.theme);

  return { app, engine };
}
