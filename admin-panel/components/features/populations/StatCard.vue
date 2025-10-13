<template>
  <div class="rounded-lg bg-gray-800/50 border border-gray-700 p-5 shadow-lg transition-all duration-300 hover:bg-gray-800 hover:border-gray-600">
    <div class="flex items-center">
      <div class="flex-shrink-0 bg-gray-700/50 rounded-md p-3">
        <component :is="icon" class="h-6 w-6 text-blue-400" aria-hidden="true" />
      </div>
      <div class="ml-5 flex-grow">
        <p class="text-sm font-medium text-gray-400 truncate">{{ label }}</p>
        <p class="text-2xl font-semibold text-white">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  icon: any;
}>();
</script>
