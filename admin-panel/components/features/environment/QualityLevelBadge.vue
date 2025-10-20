<template>
  <span
    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
    :class="style.color"
  >
    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="style.iconColor.replace('text-', 'bg-')"></span>
    <span :class="style.textColor">{{ level }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getQualityLevelStyle } from '~/utils/environmentStyles';
import type { QualityLevel } from '~/types/api/shared';

const props = defineProps<{
  level: QualityLevel | null | undefined;
}>();

const style = computed(() => getQualityLevelStyle(props.level));
</script>
