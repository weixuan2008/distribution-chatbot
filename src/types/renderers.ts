import type { Component } from 'vue';

export interface RendererProps {
  payload: unknown;
}

export interface RendererRegistryItem {
  key: string;
  component: Component;
}
