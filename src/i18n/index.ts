import { createI18n } from 'vue-i18n';
import enUS from '@/i18n/messages/en-US';
import zhCN from '@/i18n/messages/zh-CN';

export function createI18nInstance(locale = 'en-US') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en-US',
    messages: {
      'en-US': enUS,
      'zh-CN': zhCN
    }
  });
}
