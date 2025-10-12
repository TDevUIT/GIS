<template>
    <div class="absolute top-4 right-4 z-[1000] p-3 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700/50">
        <h3 class="text-white font-bold text-sm mb-2 border-b border-gray-600 pb-1">Urban Plan Legend</h3>
        <ul class="space-y-1">
            <li v-for="(style, type) in uniqueTypes" :key="type">
                <button
                    @click="$emit('highlight', type)"
                    class="flex items-center gap-2 w-full text-left p-1 rounded-md transition-all duration-200"
                    :class="highlightedType === type ? 'bg-blue-600/50' : 'hover:bg-gray-700/50'"
                >
                    <span
                        class="h-4 w-4 rounded-sm border border-white/20"
                        :style="{ backgroundColor: style.color }"
                    ></span>
                    <span class="text-gray-200 text-xs">{{ type }}</span>
                </button>
            </li>
            <li v-if="highlightedType">
                <button @click="$emit('highlight', null)" class="text-xs text-blue-400 hover:underline mt-2">
                    Clear Highlight
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getZoningTypeStyle } from '~/utils/urbanPlanStyles';

const props = defineProps<{
    types: string[]
    highlightedType: string | null
}>()

defineEmits(['highlight'])

const uniqueTypes = computed(() => {
    const styles: Record<string, { color: string; textColor: string }> = {};
    [...new Set(props.types)].forEach(type => {
        styles[type] = getZoningTypeStyle(type);
    })
    return styles;
})
</script>
