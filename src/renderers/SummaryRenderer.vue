<template>
  <q-banner dense class="bg-blue-1 text-dark rounded-borders">{{ summary }}</q-banner>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  payload: unknown;
}>();

const summary = computed(() => String(props.payload ?? ''));
</script>
