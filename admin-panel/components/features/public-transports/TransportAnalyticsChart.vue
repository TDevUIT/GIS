<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 h-full flex flex-col">
        <h3 class="text-base font-semibold text-white mb-3">{{ title }}</h3>
        <div class="flex-grow">
            <Bar v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="flex items-center justify-center h-full text-gray-500 text-sm">
                No data to display.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { getTransportModeStyle } from '~/utils/transportStyles';
import type { TransportMode } from '~/types/api/shared';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
    title: string;
    label: string;
    chartLabels: TransportMode[];
    chartValues: number[];
}>();

const chartData = computed<ChartData<'bar'>>(() => ({
    labels: props.chartLabels,
    datasets: [
        {
            label: props.label,
            backgroundColor: props.chartLabels.map(mode => getTransportModeStyle(mode).color),
            borderColor: props.chartLabels.map(mode => getTransportModeStyle(mode).borderColor),
            borderWidth: 1,
            borderRadius: 4,
            data: props.chartValues,
        },
    ],
}));

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#E5E7EB',
            bodyColor: '#D1D5DB',
        },
    },
    scales: {
        x: {
            beginAtZero: true,
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
