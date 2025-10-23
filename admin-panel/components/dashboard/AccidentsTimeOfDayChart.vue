<template>
    <div class="relative h-full w-full min-h-[250px] flex items-center justify-center">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10 rounded-lg">
            <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>

        <div v-else-if="hasData" class="h-full w-full">
            <Doughnut :data="chartData" :options="chartOptions" />
        </div>

        <div v-else class="text-center text-gray-500">
            <ClockIcon class="h-12 w-12 mx-auto mb-2" />
            <p class="font-semibold">No Accident Data</p>
            <p class="text-sm">There is no recorded accident data yet.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { ClockIcon } from '@heroicons/vue/24/outline';
import type { AccidentsByTimeOfDay } from '~/types/api/analytics';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const props = defineProps<{
    accidentsData: AccidentsByTimeOfDay[] | null | undefined;
    isLoading?: boolean;
}>();

const allTimeSlots = ['Morning (6-12h)', 'Afternoon (12-17h)', 'Evening (17-21h)', 'Night (21-6h)'];

const chartData = computed<ChartData<'doughnut'>>(() => {
    const data = props.accidentsData || [];
    const dataMap = new Map(data.map(d => [d.timeOfDay, d.accidentCount]));
    return {
        labels: allTimeSlots,
        datasets: [
            {
                data: allTimeSlots.map(slot => dataMap.get(slot) || 0),
                backgroundColor: ['#FBBF24', '#F97316', '#DC2626', '#4F46E5'],
                borderColor: '#1f2937',
                borderWidth: 2,
            },
        ],
    };
});

const hasData = computed(() => chartData.value.datasets[0].data.some(count => count > 0));

const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { color: '#D1D5DB' },
        },
    },
    cutout: '60%',
};
</script>
