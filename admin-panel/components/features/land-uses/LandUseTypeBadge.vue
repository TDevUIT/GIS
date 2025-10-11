<template>
    <span
        class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold"
        :style="{ backgroundColor: color, color: textColor }"
    >
        {{ type }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLandUseTypeStyle } from '~/utils/landUseStyles';

const props = defineProps<{
    type: string;
}>();

const style = getLandUseTypeStyle(props.type);
const color = computed(() => style.value?.color ?? '#e5e7eb'); // default bg color
const textColor = computed(() => style.value?.textColor ?? '#374151'); // default text color
</script>
