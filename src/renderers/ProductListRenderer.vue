<template>
  <q-list bordered separator>
    <q-item v-for="(product, index) in products" :key="product.id ?? index">
      <q-item-section>
        <q-item-label>{{ product.name ?? '-' }}</q-item-label>
        <q-item-label caption>{{ product.description ?? '' }}</q-item-label>
      </q-item-section>
      <q-item-section side>{{ product.price ?? '-' }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductItem } from '@/types/chat';

const props = defineProps<{
  payload: unknown;
}>();

const products = computed(() => (Array.isArray(props.payload) ? (props.payload as ProductItem[]) : []));
</script>
