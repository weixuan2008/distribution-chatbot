import { onBeforeUnmount, ref } from 'vue';
import {
  AudioConfig,
  CancellationReason,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer
} from 'microsoft-cognitiveservices-speech-sdk';

function startContinuous(recognizer: SpeechRecognizer): Promise<void> {
  return new Promise((resolve, reject) => {
    recognizer.startContinuousRecognitionAsync(resolve, reject);
  });
}

function stopContinuous(recognizer: SpeechRecognizer): Promise<void> {
  return new Promise((resolve, reject) => {
    recognizer.stopContinuousRecognitionAsync(resolve, reject);
  });
}

export function useAzureSpeech() {
  const isRecording = ref(false);
  const transcript = ref('');
  const error = ref<string>();
  const isConfigured = ref(
    Boolean(import.meta.env.VITE_AZURE_SPEECH_KEY && import.meta.env.VITE_AZURE_SPEECH_REGION)
  );

  let recognizer: SpeechRecognizer | undefined;
  let finalText = '';

  function resetTranscript() {
    transcript.value = '';
    finalText = '';
  }

  async function start(): Promise<void> {
    if (!isConfigured.value) {
      error.value = 'Azure Speech is not configured.';
      return;
    }
    if (isRecording.value) {
      return;
    }

    resetTranscript();
    error.value = undefined;

    try {
      const key = import.meta.env.VITE_AZURE_SPEECH_KEY;
      const region = import.meta.env.VITE_AZURE_SPEECH_REGION;
      if (!key || !region) {
        error.value = 'Azure Speech is not configured.';
        return;
      }

      const speechConfig = SpeechConfig.fromSubscription(key, region);
      speechConfig.speechRecognitionLanguage = import.meta.env.VITE_AZURE_SPEECH_LANGUAGE ?? 'zh-CN';

      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizing = (_, event) => {
        const text = event.result?.text?.trim() ?? '';
        transcript.value = [finalText, text].filter(Boolean).join(' ').trim();
      };

      recognizer.recognized = (_, event) => {
        if (event.result.reason === ResultReason.RecognizedSpeech) {
          const text = event.result.text?.trim() ?? '';
          if (text) {
            finalText = [finalText, text].filter(Boolean).join(' ').trim();
            transcript.value = finalText;
          }
        }
      };

      recognizer.canceled = (_, event) => {
        isRecording.value = false;
        if (event.reason === CancellationReason.Error) {
          error.value = event.errorDetails || 'Speech recognition failed.';
        }
      };

      recognizer.sessionStopped = () => {
        isRecording.value = false;
      };

      await startContinuous(recognizer);
      isRecording.value = true;
    } catch (err) {
      isRecording.value = false;
      error.value = err instanceof Error ? err.message : 'Speech recognition failed.';
      if (recognizer) {
        recognizer.close();
        recognizer = undefined;
      }
    }
  }

  async function stop(): Promise<string> {
    if (!recognizer) {
      isRecording.value = false;
      return transcript.value.trim();
    }

    await stopContinuous(recognizer);
    recognizer.close();
    recognizer = undefined;
    isRecording.value = false;

    return transcript.value.trim();
  }

  onBeforeUnmount(() => {
    if (recognizer) {
      recognizer.close();
      recognizer = undefined;
    }
  });

  return {
    isRecording,
    transcript,
    error,
    isConfigured,
    start,
    stop
  };
}
