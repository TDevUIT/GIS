<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg flex flex-col h-full">
        <div class="flex-shrink-0 flex items-center gap-3 mb-4">
            <component v-if="icon" :is="icon" class="h-6 w-6 text-gray-400" />
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
        </div>
        <div class="flex-grow overflow-y-auto">
             <div v-if="isLoading" class="flex items-center justify-center h-full">
                <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <ul v-else-if="items && items.length" class="space-y-3">
                <li v-for="(item, index) in items" :key="item.id" class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-gray-500 w-6 text-center">{{ index + 1 }}</span>
                        <span class="text-gray-300">{{ item.label }}</span>
                    </div>
                    <span class="font-semibold text-white tabular-nums">{{ item.value.toLocaleString() }}
                        <span class="text-xs text-gray-400 ml-1">{{ unit }}</span>
                    </span>
                </li>
            </ul>
             <p v-else class="text-center text-gray-500 text-sm h-full flex items-center justify-center">No data available.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue';
interface RankingItem {
    id: string;
    label: string;
    value: number;
}

defineProps<{
    title: string;
    items: RankingItem[];
    unit: string;
    icon?: FunctionalComponent;
    isLoading?: boolean;
}>();
</script>
