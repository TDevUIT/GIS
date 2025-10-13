<template>
    <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-full flex flex-col">
        <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
        <div class="flex-grow min-h-0 relative">
            <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
                <p>No data to display.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartItem {
    [key: string]: string | number;
    count: number;
}

const props = defineProps<{
    title: string;
    data: ChartItem[] | undefined;
    labelKey: string;
}>();

const chartColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
];

const chartData = computed(() => {
    if (!props.data || props.data.length === 0) {
        return null;
    }
    
    return {
        labels: props.data.map(item => item[props.labelKey]),
        datasets: [
            {
                backgroundColor: chartColors.slice(0, props.data.length),
                data: props.data.map(item => item.count),
                borderColor: '#374151',
                borderWidth: 2,
            },
        ],
    };
});

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right' as const,
            labels: {
                color: '#D1D5DB',
                boxWidth: 15,
                padding: 15,
            },
        },
    },
}));
</script>
