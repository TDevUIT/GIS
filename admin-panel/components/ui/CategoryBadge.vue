<template>
    <span
        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        :class="badgeClass"
    >
        {{ categoryLabel }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InfraCategory } from '~/types/api/infrastructure';

const props = defineProps<{
    category: InfraCategory;
}>();

const categoryInfo: Record<string, { label: string; color: string }> = {
    HOSPITAL: { label: 'Hospital', color: 'bg-red-200 text-red-800' },
    SCHOOL: { label: 'School', color: 'bg-blue-200 text-blue-800' },
    MARKET: { label: 'Market', color: 'bg-yellow-200 text-yellow-800' },
    PARK: { label: 'Park', color: 'bg-green-200 text-green-800' },
    UTILITY: { label: 'Utility', color: 'bg-purple-200 text-purple-800' },
};

const badgeClass = computed(() => categoryInfo[props.category]?.color || 'bg-gray-200 text-gray-800');
const categoryLabel = computed(() => categoryInfo[props.category]?.label || props.category);
</script>
