<template>
  <div class="markdown-text" v-html="safeHtml"></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';

const props = defineProps<{
  content: string;
}>();

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
});

const safeHtml = computed(() => DOMPurify.sanitize(markdown.render(props.content ?? '')));
</script>

<style scoped>
.markdown-text :deep(p) {
  margin: 0;
}
</style>
