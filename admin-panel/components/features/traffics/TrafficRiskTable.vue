<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 h-full flex flex-col">
        <h3 class="text-base font-semibold text-white mb-3">Top 5 Riskiest Routes (RFM Model)</h3>
        <div class="flex-grow overflow-y-auto">
            <table class="min-w-full">
                <thead class="sticky top-0 bg-gray-800/50 backdrop-blur-sm">
                    <tr>
                        <th class="py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Road Name</th>
                        <th class="py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider" title="Recency (Days Ago)">R</th>
                        <th class="py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider" title="Frequency (Total Accidents)">F</th>
                        <th class="py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider" title="Magnitude (Severity Score)">M</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700/50">
                    <tr v-if="!data || data.length === 0">
                        <td colspan="4" class="py-4 text-center text-sm text-gray-500">No risk data available.</td>
                    </tr>
                    <tr v-for="(item, index) in data" :key="item.id" class="hover:bg-gray-700/30">
                        <td class="py-2 text-sm text-gray-200">
                            <span class="font-bold mr-2">{{ index + 1 }}.</span> {{ item.roadName }}
                        </td>
                        <td class="py-2 text-center text-sm" :class="getRecencyColor(item.recency)">{{ item.recency }}d</td>
                        <td class="py-2 text-center text-sm font-bold text-amber-400">{{ item.frequency }}</td>
                        <td class="py-2 text-center text-sm font-bold text-orange-400">{{ item.magnitude }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TrafficRisk } from '~/types/api/analytics';

defineProps<{
    data: TrafficRisk[] | null | undefined;
}>();

const getRecencyColor = (days: number) => {
    if (days < 7) return 'text-red-400 font-bold';
    if (days < 30) return 'text-yellow-400';
    return 'text-green-400';
};
</script>
