<template>
  <component :is="componentToRender" :payload="payload" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SummaryRenderer from '@/renderers/SummaryRenderer.vue';
import { rendererRegistry } from '@/renderers/registry';

const props = defineProps<{
  rendererType: string;
  payload: unknown;
}>();

const componentToRender = computed(() => rendererRegistry.getRenderer(props.rendererType) ?? SummaryRenderer);
</script>
