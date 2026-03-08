import type { ChatbotPlugin } from '@/types/plugins';
import ContactListRenderer from '@/renderers/ContactListRenderer.vue';

export const contactRendererPlugin: ChatbotPlugin = {
  name: 'contact-renderer-plugin',
  setup({ registerRenderer }) {
    registerRenderer('contacts', ContactListRenderer);
  }
};
