import type { ChatbotPlugin } from '@/types/plugins';
import TextRenderer from '@/renderers/TextRenderer.vue';

export const markdownRendererPlugin: ChatbotPlugin = {
  name: 'markdown-renderer-plugin',
  setup({ registerRenderer }) {
    registerRenderer('text', TextRenderer);
  }
};
