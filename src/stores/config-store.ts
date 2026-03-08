import { defineStore } from 'pinia';
import type { ChatApiConfig } from '@/types/config';

export interface ConfigState {
  theme: string;
  locale: string;
  apiConfig: ChatApiConfig;
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    theme: 'light',
    locale: 'en-US',
    apiConfig: {
      apiBaseUrl: '',
      token: '',
      agentId: '',
      agentName: '',
      user: 'anonymous',
      workflowId: ''
    }
  }),
  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
    setLocale(locale: string) {
      this.locale = locale;
    },
    setApiConfig(apiConfig: ChatApiConfig) {
      this.apiConfig = apiConfig;
    }
  }
});
