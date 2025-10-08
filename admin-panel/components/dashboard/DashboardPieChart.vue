<template>
  <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg">
    <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
    <div v-if="chartData.labels && chartData.labels.length > 0">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="text-center text-gray-400 py-8">
      No data available
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
