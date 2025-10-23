<template>
    <div class="relative h-full w-full min-h-[250px] flex items-center justify-center">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10 rounded-lg">
            <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <div v-else-if="chartData.labels && chartData.labels.length > 0" class="h-full w-full">
            <Bar :data="chartData" :options="chartOptions" />
        </div>
        <div v-else class="text-center text-gray-500">
             <ChartBarIcon class="h-12 w-12 mx-auto mb-2" />
             <p class="font-semibold">No Population Data</p>
             <p class="text-sm">Data for the selected district is not available.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { ChartBarIcon } from '@heroicons/vue/24/outline';
import type { PopulationHistoryPoint } from '~/types/api/analytics';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
    populationData: PopulationHistoryPoint[] | null | undefined;
    isLoading?: boolean;
}>();

const chartData = computed<ChartData<'bar'>>(() => {
    const data = props.populationData || [];
    return {
        labels: data.map(p => p.year),
        datasets: [{
            label: 'Total Population',
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#1E40AF',
            borderRadius: 4,
            borderWidth: 1,
            data: data.map(p => p.populationTotal),
        }]
    };
});

const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
        y: {
            ticks: { color: '#9CA3AF' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
    }
};
</script>
