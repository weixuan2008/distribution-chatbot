<template>
  <div ref="container" class="message-list">
    <div v-if="messages.length === 0" class="empty">{{ t('chatbot.empty') }}</div>
    <ChatMessageItem v-for="msg in messages" :key="msg.id" :message="msg" @retry="onRetry" />
    <div v-if="loading" class="loading">{{ t('chatbot.loading') }}</div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ChatMessageItem from '@/components/ChatMessageItem.vue';
import type { ChatMessage } from '@/types/chat';

const props = defineProps<{
  messages: ChatMessage[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  retry: [message: ChatMessage];
}>();

const { t } = useI18n();
const container = ref<HTMLDivElement | null>(null);

function onRetry(message: ChatMessage): void {
  emit('retry', message);
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight;
    }
  }
);
</script>

<style scoped>
.message-list {
  height: 100%;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty,
.loading {
  color: #888;
  text-align: center;
  margin-top: 10px;
}
</style>
