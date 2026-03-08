<template>
  <div class="widget-root">
    <ChatContainer :width="width" :height="height" :welcome-message="welcomeMessage" />
  </div>
</template>

<script setup lang="ts">
import ChatContainer from '@/components/ChatContainer.vue';

defineProps<{
  width?: string;
  height?: string;
  welcomeMessage?: string;
}>();
</script>

<style scoped>
.widget-root {
  display: inline-block;
}
</style>
