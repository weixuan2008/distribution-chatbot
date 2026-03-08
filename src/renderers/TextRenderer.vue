<template>
  <MarkdownText :content="text" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownText from '@/components/renderers/MarkdownText.vue';

const props = defineProps<{
  payload: unknown;
}>();

const text = computed(() => String(props.payload ?? ''));
</script>
