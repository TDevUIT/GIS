<template>
  <span
    class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold"
    :style="{ backgroundColor: style.color, color: style.textColor }"
  >
    {{ mode }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getTransportModeStyle } from '~/utils/transportStyles';
import type { TransportMode } from '~/types/api/shared';

const props = defineProps<{
  mode: TransportMode;
}>();

const style = computed(() => getTransportModeStyle(props.mode));
</script>
