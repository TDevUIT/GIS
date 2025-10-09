<template>
    <div class="relative h-72">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800/50 text-gray-400 z-10 rounded-lg">
            <svg class="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading Chart Data...</span>
        </div>
        <div v-else-if="chartData.labels && chartData.labels.length > 0" class="h-full">
            <Line :data="chartData" :options="chartOptions" />
        </div>
        <div v-else class="absolute inset-0 flex items-center justify-center text-gray-500">
            No data available for the selected district.
        </div>
    </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

defineProps<{
    chartData: ChartData<'line'>;
    isLoading?: boolean;
}>();

const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            align: 'end',
            labels: {
                color: '#D1D5DB',
                boxWidth: 12,
                usePointStyle: true,
                pointStyle: 'circle'
            },
        },
    },
    scales: {
        x: {
            ticks: { color: '#9CA3AF' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        y: {
            ticks: { color: '#9CA3AF' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
        },
    },
};
</script>
