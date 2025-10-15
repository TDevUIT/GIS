<template>
    <li class="flex items-start gap-4 py-3">
        <div class="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-lg" :style="{ backgroundColor: style.color }">
            <span class="text-white font-bold text-lg">{{ day }}</span>
            <span class="text-white/80 text-xs">{{ month }}</span>
        </div>
        <div class="flex-grow">
            <div class="flex justify-between items-center">
                <p class="text-sm font-semibold text-white">
                    Severity:
                    <FeaturesTrafficsSeverityBadge :type="accident.severity" />
                </p>
                <span class="text-xs text-gray-400">{{ time }}</span>
            </div>
            <p class="text-sm text-gray-300 mt-1">
                Casualties: <span class="font-medium text-white">{{ accident.casualties ?? 0 }}</span>
            </p>
        </div>
        <div class="flex-shrink-0 flex items-center gap-2">
             <button @click="$emit('edit', accident)" class="text-blue-400 hover:text-blue-300" title="Edit Accident">
                <PencilIcon class="h-4 w-4" />
            </button>
            <button @click="$emit('delete', accident.id)" class="text-red-400 hover:text-red-300" title="Delete Accident">
                <TrashIcon class="h-4 w-4" />
            </button>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Accident } from '~/types/api/accident';
import { getSeverityStyle } from '~/utils/trafficStyles';

const props = defineProps<{
    accident: Accident;
}>();

defineEmits(['edit', 'delete']);

const date = computed(() => new Date(props.accident.accidentDate));
const day = computed(() => date.value.getDate());
const month = computed(() => date.value.toLocaleString('en-US', { month: 'short' }));
const time = computed(() => date.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
const style = computed(() => getSeverityStyle(props.accident.severity));
</script>
