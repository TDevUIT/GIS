<template>
  <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg">
    <div class="flex items-center gap-4">
      <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" :class="iconBgClass">
        <component :is="icon" class="h-6 w-6 text-white" />
      </div>
      <div>
        <p class="text-sm font-medium text-gray-400">{{ title }}</p>
        <p class="text-2xl font-bold text-white">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue';

defineProps<{
  title: string;
  value: string | number;
  icon: FunctionalComponent;
  iconBgClass: string;
}>();
</script>
