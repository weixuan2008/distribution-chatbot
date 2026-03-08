import TextRenderer from '@/renderers/TextRenderer.vue';
import ContactListRenderer from '@/renderers/ContactListRenderer.vue';
import TableRenderer from '@/renderers/TableRenderer.vue';

export const messageRendererMap = {
  text: TextRenderer,
  contacts: ContactListRenderer,
  table: TableRenderer
};
