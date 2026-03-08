import type { ChatEngine } from '@/engine/chat-engine';
import type { RendererRegistry } from '@/renderers/registry';

export interface ChatbotPluginContext {
  engine: ChatEngine;
  registerRenderer: RendererRegistry['registerRenderer'];
}

export interface ChatbotPlugin {
  name: string;
  setup: (context: ChatbotPluginContext) => void;
}
