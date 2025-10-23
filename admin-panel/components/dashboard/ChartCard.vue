<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg flex flex-col h-full">
        <div class="flex-shrink-0 flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <component v-if="icon" :is="icon" class="h-6 w-6 text-gray-400" />
                <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
            </div>
            <div v-if="$slots.actions">
                <slot name="actions" />
            </div>
        </div>
        <div class="flex-grow flex items-center justify-center relative min-h-[320px]">
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10">
                <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue';
defineProps<{
    title: string;
    icon?: FunctionalComponent;
    isLoading?: boolean;
}>();
</script>
