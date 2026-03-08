import { shallowRef, type Component, type ShallowRef } from 'vue';
import type { RendererRegistryItem } from '@/types/renderers';

class RendererRegistryImpl {
  private readonly map = new Map<string, Component>();
  public readonly items: ShallowRef<RendererRegistryItem[]> = shallowRef([]);

  public registerRenderer(key: string, component: Component): void {
    this.map.set(key, component);
    this.items.value = Array.from(this.map.entries()).map(([entryKey, entryComponent]) => ({
      key: entryKey,
      component: entryComponent
    }));
  }

  public getRenderer(key: string): Component | undefined {
    return this.map.get(key);
  }
}

export type RendererRegistry = RendererRegistryImpl;
export const rendererRegistry = new RendererRegistryImpl();
