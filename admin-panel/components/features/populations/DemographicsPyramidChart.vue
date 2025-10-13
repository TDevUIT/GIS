<template>
    <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-full flex flex-col">
        <h3 class="text-lg font-semibold text-white mb-4">Age & Gender Pyramid</h3>
        <div class="flex-grow min-h-0 relative">
            <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
                <p>No demographic data to display.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { DemographicsSummaryPoint } from '~/types/api/analytics';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
    demographics: DemographicsSummaryPoint[] | undefined;
}>();

const chartData = computed(() => {
    if (!props.demographics || props.demographics.length === 0) {
        return null;
    }

    const labels = props.demographics.map(d => d.ageGroup);
    const maleData = props.demographics.map(d => -d.male);
    const femaleData = props.demographics.map(d => d.female);

    return {
        labels,
        datasets: [
            {
                label: 'Male',
                backgroundColor: '#3b82f6',
                borderColor: '#60a5fa',
                borderWidth: 1,
                data: maleData,
                borderRadius: { topLeft: 4, bottomLeft: 4, topRight: 0, bottomRight: 0 },
            },
            {
                label: 'Female',
                backgroundColor: '#ec4899',
                borderColor: '#f472b6',
                borderWidth: 1,
                data: femaleData,
                borderRadius: { topLeft: 0, bottomLeft: 0, topRight: 4, bottomRight: 4 },
            },
        ],
    };
});

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
        x: {
            stacked: false,
            ticks: {
                color: '#9CA3AF',
                callback: (value: number | string) => Math.abs(Number(value)).toLocaleString(),
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            title: {
                display: true,
                text: 'Population Count',
                color: '#9CA3AF',
            }
        },
        y: {
            beginAtZero: true,
            stacked: true,
            ticks: {
                color: '#D1D5DB',
            },
            grid: {
                display: false,
            },
        },
    },
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                color: '#D1D5DB',
                boxWidth: 20,
                padding: 20,
            }
        },
        tooltip: {
            yAlign: 'bottom' as const,
            titleAlign: 'center' as const,
            callbacks: {
                label: (context: any) => {
                    const label = context.dataset.label || '';
                    const value = Math.abs(context.raw as number);
                    return `${label}: ${value.toLocaleString()}`;
                },
            },
        },
    },
}));
</script>
