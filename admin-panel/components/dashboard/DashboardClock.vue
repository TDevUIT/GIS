<template>
  <div class="text-right">
    <p class="text-3xl font-bold text-white tabular-nums">{{ time }}</p>
    <p class="text-sm text-gray-400">{{ date }} (GMT+7)</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const time = ref('');
const date = ref('');
let intervalId: NodeJS.Timeout;

const updateClock = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  time.value = now.toLocaleTimeString('en-US', options);
  date.value = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(() => {
  updateClock();
  intervalId = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
