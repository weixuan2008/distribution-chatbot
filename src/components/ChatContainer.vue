<template>
  <q-card class="chat-container" :style="containerStyle">
    <q-card-section class="header">
      <div class="title">{{ t('chatbot.title') }}</div>
      <q-btn flat dense size="sm" :label="t('chatbot.reset')" @click="resetConversation" />
    </q-card-section>
    <q-separator />
    <q-card-section class="body">
      <ChatMessageList :messages="chatStore.messages" :loading="chatStore.sending" @retry="retryMessage" />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <ChatInput :disabled="chatStore.sending" @send="sendMessage" />
      <div v-if="chatStore.error" class="error">{{ chatStore.error }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useChatStore } from '@/stores/chat-store';
import { useChatEngine } from '@/composables/use-chat-engine';
import ChatMessageList from '@/components/ChatMessageList.vue';
import ChatInput from '@/components/ChatInput.vue';
import type { ChatMessage } from '@/types/chat';

const props = defineProps<{
  width?: string;
  height?: string;
  welcomeMessage?: string;
}>();

const { t } = useI18n();
const chatStore = useChatStore();
const engine = useChatEngine();

const containerStyle = computed(() => ({
  ...(props.width ? { width: props.width } : {}),
  ...(props.height ? { height: props.height } : {})
}));

if (props.welcomeMessage && chatStore.messages.length === 0) {
  chatStore.messages.push({
    id: 'welcome',
    role: 'assistant',
    text: props.welcomeMessage,
    timestamp: new Date().toISOString(),
    status: 'sent'
  });
}

async function sendMessage(query: string): Promise<void> {
  await chatStore.send(engine, query);
}

async function retryMessage(message: ChatMessage): Promise<void> {
  await chatStore.retry(engine, message);
}

function resetConversation(): void {
  engine.resetConversation();
  chatStore.reset();
  if (props.welcomeMessage) {
    chatStore.messages.push({
      id: 'welcome-reset',
      role: 'assistant',
      text: props.welcomeMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
  }
}
</script>

<style scoped>
.chat-container {
  display: grid;
  grid-template-rows: auto 1px 1fr 1px auto;
  width: 50vw;
  height: 80vh;
  max-width: 100vw;
  max-height: 100vh;
}

@media (max-width: 1023px) {
  .chat-container {
    width: 66.6667vw;
  }
}

@media (max-width: 767px) {
  .chat-container {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.body {
  overflow: hidden;
  min-height: 0;
}

.title {
  font-weight: 600;
}

.error {
  margin-top: 8px;
  color: #b00020;
  font-size: 12px;
}
</style>
