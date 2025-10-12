<template>
  <span
    class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold"
    :style="{ backgroundColor: style.color, color: style.textColor }"
  >
    {{ type }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getZoningTypeStyle } from '~/utils/urbanPlanStyles';

const props = defineProps<{
  type: string;
}>();

const style = computed(() => getZoningTypeStyle(props.type));
</script>
