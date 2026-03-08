import SummaryRenderer from '@/renderers/SummaryRenderer.vue';
import ContactListRenderer from '@/renderers/ContactListRenderer.vue';
import ProductListRenderer from '@/renderers/ProductListRenderer.vue';
import TableRenderer from '@/renderers/TableRenderer.vue';
import TextRenderer from '@/renderers/TextRenderer.vue';
import { rendererRegistry } from '@/renderers/registry';

let initialized = false;

export function initDefaultRenderers(): void {
  if (initialized) {
    return;
  }
  rendererRegistry.registerRenderer('text', TextRenderer);
  rendererRegistry.registerRenderer('summary', SummaryRenderer);
  rendererRegistry.registerRenderer('contacts', ContactListRenderer);
  rendererRegistry.registerRenderer('products', ProductListRenderer);
  rendererRegistry.registerRenderer('table', TableRenderer);
  initialized = true;
}
