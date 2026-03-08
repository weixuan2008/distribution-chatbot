import { createApp, defineComponent, type App as VueApp } from 'vue';
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
import ChatbotWidget from '@/components/ChatbotWidget.vue';

import 'quasar/src/css/index.sass';
import '@/css/app.scss';

export function createChatbotWidgetApp(runtimeConfig: ChatbotRuntimeConfig = {}): {
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

  const Root = defineComponent({
    components: { ChatbotWidget },
    setup() {
      return {
        width: uiConfig.width,
        height: uiConfig.height,
        welcomeMessage: uiConfig.welcomeMessage
      };
    },
    template: `<ChatbotWidget :width="width" :height="height" :welcome-message="welcomeMessage" />`
  });

  const app = createApp(Root);
  app.use(pinia);
  app.use(i18n);
  app.use(Quasar, {});
  app.provide(CHAT_ENGINE_KEY, engine);

  const configStore = useConfigStore(pinia);
  configStore.setApiConfig(apiConfig);
  configStore.setLocale(uiConfig.locale);
  configStore.setTheme(uiConfig.theme);

  return { app, engine };
}
