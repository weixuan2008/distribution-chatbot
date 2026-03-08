import type { ChatbotPlugin } from '@/types/plugins';
import type { Component } from 'vue';
import { rendererRegistry } from '@/renderers/registry';
import type { ChatEngine } from '@/engine/chat-engine';

const plugins: ChatbotPlugin[] = [];

export function registerRenderer(key: string, component: Component): void {
  rendererRegistry.registerRenderer(key, component);
}

export function registerPlugin(plugin: ChatbotPlugin, engine: ChatEngine): void {
  plugins.push(plugin);
  plugin.setup({
    engine,
    registerRenderer
  });
}

export function getRegisteredPlugins(): ChatbotPlugin[] {
  return [...plugins];
}
