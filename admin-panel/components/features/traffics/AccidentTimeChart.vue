<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 h-full">
        <h3 class="text-base font-semibold text-white mb-3">{{ title }}</h3>
        <Bar v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="flex items-center justify-center h-full text-gray-500 text-sm">
            No data to display.
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
    title: string;
    chartLabels: string[];
    chartValues: number[];
}>();

const chartData = computed<ChartData<'bar'>>(() => ({
    labels: props.chartLabels,
    datasets: [
        {
            label: 'Number of Accidents',
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 4,
            data: props.chartValues,
        },
    ],
}));

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#E5E7EB',
            bodyColor: '#D1D5DB',
            boxPadding: 4,
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                color: '#9CA3AF',
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                color: '#9CA3AF',
                stepSize: 1,
            },
        },
    },
}));
</script>
