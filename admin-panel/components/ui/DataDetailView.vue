<template>
    <div class="flex flex-col h-full rounded-lg border border-gray-700 bg-gray-800/50">
        <div class="flex-shrink-0 border-b border-gray-700 px-4 py-3">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
                <button v-if="item" @click="$emit('close')" class="text-gray-400 hover:text-white">
                    <XMarkIcon class="h-6 w-6" />
                </button>
            </div>
        </div>
        <div class="flex-grow overflow-y-auto p-6">
            <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
            >
                <div v-if="!item" key="placeholder" class="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <InformationCircleIcon class="h-12 w-12 mb-4" />
                    <p class="font-semibold">No item selected</p>
                    <p class="text-sm">Click on a row in the table to view its details here.</p>
                </div>
                <div v-else key="details" class="space-y-4">
                    <slot :item="item" />
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

defineProps<{
    title: string;
    item: object | null;
}>();

defineEmits(['close']);
</script>
