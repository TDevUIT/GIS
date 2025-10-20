<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 h-full flex flex-col">
        <h3 class="text-base font-semibold text-white mb-3">{{ title }}</h3>
        <div class="flex-grow">
            <Line v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="flex items-center justify-center h-full text-gray-500 text-sm">
                No historical data available for this district.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps<{
    title: string;
    chartData: ChartData<'line'>;
}>();

const chartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#D1D5DB',
                boxWidth: 12,
                font: { size: 12 }
            }
        },
        tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#E5E7EB',
            bodyColor: '#D1D5DB',
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#9CA3AF' },
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#9CA3AF' },
        },
    },
}));
</script>
