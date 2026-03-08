<template>
  <div class="contact-grid">
    <q-card v-for="(contact, index) in contacts" :key="contact.id ?? index" flat bordered class="contact-card">
      <q-card-section>
        <div class="name">{{ contact.name ?? '-' }}</div>
        <div class="line">Phone: {{ contact.phone ?? '-' }}</div>
        <div class="line">Email: {{ contact.email ?? '-' }}</div>
        <div class="line">Birth: {{ contact.birth ?? '-' }}</div>
        <div class="line">Occupation: {{ contact.occupation ?? '-' }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Contact } from '@/types/chat';

const props = defineProps<{
  payload: unknown;
}>();

const contacts = computed(() => (Array.isArray(props.payload) ? (props.payload as Contact[]) : []));
</script>

<style scoped>
.contact-grid {
  display: grid;
  gap: 8px;
}

.name {
  font-weight: 600;
  margin-bottom: 4px;
}

.line {
  font-size: 13px;
}
</style>
