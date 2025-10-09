<template>
  <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-10 pb-20 shadow-lg">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    <div class="relative h-64">
      <div v-if="chartData.labels && chartData.labels.length > 0">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
      <div v-else class="flex h-full items-center justify-center text-center text-gray-400">
        No data available
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

defineProps<{
  title: string;
  chartData: ChartData<'pie'>;
}>();

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#D1D5DB',
        boxWidth: 20,
      },
    },
  },
};
</script>
