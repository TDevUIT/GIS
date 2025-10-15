<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize"
    :style="{ backgroundColor: style.color, color: style.textColor }"
  >
    {{ type?.toLowerCase() }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getSeverityStyle } from '~/utils/trafficStyles';
import type { AccidentSeverity } from '~/types/api/accident';

const props = defineProps<{
  type: AccidentSeverity | undefined;
}>();

const style = computed(() => getSeverityStyle(props.type));
</script>
