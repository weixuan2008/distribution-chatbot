<template>
  <div class="chat-input">
    <div v-if="isRecording" class="voice-panel">
      <div class="voice-wave" aria-hidden="true">
        <span v-for="bar in 12" :key="bar" class="bar" :style="{ animationDelay: `${bar * 90}ms` }"></span>
      </div>
      <div class="voice-text">{{ draft || listeningText }}</div>
    </div>

    <q-input
      v-model="draft"
      type="textarea"
      autogrow
      dense
      outlined
      :placeholder="t('chatbot.placeholder')"
      @keydown="onKeydown"
    />
    <div class="actions">
      <q-btn
        round
        color="primary"
        icon="send"
        :disable="disabled || isRecording || !draft.trim()"
        @click="send"
      />
      <q-btn
        round
        :color="isRecording ? 'negative' : 'secondary'"
        :icon="isRecording ? 'radio_button_checked' : 'mic'"
        :disable="disabled || !isSpeechConfigured"
        @click="toggleVoice"
      />
    </div>
    <div v-if="speech.error" class="voice-error">{{ speech.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAzureSpeech } from '@/composables/use-azure-speech';

const emit = defineEmits<{
  send: [text: string];
}>();

defineProps<{
  disabled?: boolean;
}>();

const { t } = useI18n();
const draft = ref('');
const speech = useAzureSpeech();
const isRecording = ref(false);
const isSpeechConfigured = ref(false);
const listeningText = ref('');

watch(
  () => speech.isRecording.value,
  (value) => {
    isRecording.value = value;
  },
  { immediate: true }
);

watch(
  () => speech.isConfigured.value,
  (value) => {
    isSpeechConfigured.value = value;
  },
  { immediate: true }
);

watch(
  () => t('chatbot.listening'),
  (value) => {
    listeningText.value =
      value === 'chatbot.listening' ? '正在语音识别，点击麦克风按钮再次发送语音。' : value;
  },
  { immediate: true }
);

watch(
  () => speech.transcript.value,
  (value) => {
    if (isRecording.value) {
      draft.value = value;
    }
  }
);

function send(): void {
  if (isRecording.value) {
    return;
  }
  const text = draft.value.trim();
  if (!text) {
    return;
  }
  emit('send', text);
  draft.value = '';
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    send();
  }
}

async function toggleVoice(): Promise<void> {
  try {
    if (isRecording.value) {
      const voiceText = await speech.stop();
      if (voiceText) {
        emit('send', voiceText);
        draft.value = '';
      }
      return;
    }

    draft.value = '';
    await speech.start();
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.chat-input {
  display: grid;
  gap: 10px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.voice-panel {
  border: 1px solid #f3c4cc;
  background: #fff5f7;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  gap: 8px;
}

.voice-wave {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 22px;
}

.bar {
  width: 4px;
  height: 6px;
  border-radius: 2px;
  background: #e7526f;
  animation: wave 900ms ease-in-out infinite;
}

.voice-text {
  color: #7f1d2a;
  font-size: 12px;
}

.voice-error {
  color: #b00020;
  font-size: 12px;
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(0.45);
  }
  50% {
    transform: scaleY(1.7);
  }
}
</style>
