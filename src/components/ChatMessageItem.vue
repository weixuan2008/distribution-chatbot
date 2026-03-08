<template>
  <div class="message-item" :class="message.role">
    <div class="message-content">
      <div class="author-row">
        <q-avatar size="28px" class="author-avatar">
          <q-icon :name="authorIcon" size="18px" />
        </q-avatar>
        <span class="author-name">{{ authorName }}</span>
      </div>

      <div class="bubble">
        <MarkdownText v-if="message.text" :content="message.text" />

        <div v-if="message.structured?.summary" class="block">
          <MessageRendererHost renderer-type="summary" :payload="message.structured.summary" />
        </div>
        <div v-if="message.structured?.contact_list?.length" class="block">
          <MessageRendererHost renderer-type="contacts" :payload="message.structured.contact_list" />
        </div>
        <div v-if="message.structured?.product_list?.length" class="block">
          <MessageRendererHost renderer-type="products" :payload="message.structured.product_list" />
        </div>
        <div v-if="message.structured?.quotation_list?.length" class="block">
          <MessageRendererHost renderer-type="table" :payload="message.structured.quotation_list" />
        </div>

        <div class="meta">
          <span>{{ dateText }}</span>
          <q-btn
            v-if="message.status === 'error'"
            flat
            size="sm"
            color="negative"
            :label="t('chatbot.retry')"
            @click="emit('retry', message)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MessageRendererHost from '@/components/MessageRendererHost.vue';
import MarkdownText from '@/components/renderers/MarkdownText.vue';
import { useConfigStore } from '@/stores/config-store';
import type { ChatMessage } from '@/types/chat';

const { t } = useI18n();
const emit = defineEmits<{
  retry: [message: ChatMessage];
}>();

const props = defineProps<{
  message: ChatMessage;
}>();

const configStore = useConfigStore();
const dateText = computed(() => new Date(props.message.timestamp).toLocaleTimeString());
const isAssistant = computed(() => props.message.role === 'assistant');
const authorName = computed(() => {
  if (isAssistant.value) {
    return '小友';
  }
  return configStore.apiConfig.user || 'User';
});
const authorIcon = computed(() => (isAssistant.value ? 'smart_toy' : 'person'));
</script>

<style scoped>
.message-item {
  display: flex;
}

.message-item.user {
  justify-content: flex-end;
}

.message-item.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 88%;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.author-avatar {
  color: #fff;
  background: #6f7f91;
}

.author-name {
  font-size: 13px;
  color: #4b5563;
}

.bubble {
  background: #f4f7fb;
  border-radius: 12px;
  padding: 10px;
}

.message-item.user .author-row {
  justify-content: flex-end;
}

.message-item.user .author-avatar {
  background: #1778f2;
}

.message-item.user .bubble {
  background: #d6ecff;
}

.meta {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
}

.block {
  margin-top: 10px;
}
</style>
