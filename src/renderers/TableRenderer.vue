<template>
  <q-markup-table dense flat bordered>
    <thead>
      <tr>
        <th v-for="key in keys" :key="key">{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="key in keys" :key="key">{{ stringify(row[key]) }}</td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  payload: unknown;
}>();

const rows = computed(() =>
  Array.isArray(props.payload) ? (props.payload as Record<string, unknown>[]) : []
);
const keys = computed(() => Object.keys(rows.value[0] ?? {}));

function stringify(value: unknown): string {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value ?? '');
}
</script>
