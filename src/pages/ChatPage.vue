<template>
  <div class="page">
    <ChatbotWidget :welcome-message="uiConfig.welcomeMessage" />
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config-store';
import ChatbotWidget from '@/components/ChatbotWidget.vue';

const configStore = useConfigStore();
const uiConfig = {
  welcomeMessage: import.meta.env.VITE_CHATBOT_WELCOME_MESSAGE ?? 'Hello, how can I help you today?'
};
configStore.setTheme(import.meta.env.VITE_CHATBOT_THEME ?? 'light');
</script>

<style scoped>
.page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background:
    radial-gradient(circle at 0 0, #d4edff 0%, transparent 45%),
    radial-gradient(circle at 100% 100%, #ffe6d8 0%, transparent 45%),
    #f8fafc;
  padding: 20px;
}

@media (max-width: 767px) {
  .page {
    padding: 0;
  }
}
</style>
