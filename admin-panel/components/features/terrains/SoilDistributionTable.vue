<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 h-full flex flex-col">
        <h3 class="text-base font-semibold text-white mb-3">Soil Type Distribution</h3>
        <div class="flex-grow overflow-y-auto">
            <table class="min-w-full">
                <thead class="sticky top-0 bg-gray-800/50 backdrop-blur-sm">
                    <tr>
                        <th class="py-2 pl-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Soil Type</th>
                        <th class="py-2 pr-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Count</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700/50">
                    <tr v-if="!data || data.length === 0">
                        <td colspan="2" class="py-4 text-center text-sm text-gray-500">No data available.</td>
                    </tr>
                    <tr v-for="item in data" :key="item.soilType">
                        <td class="py-2 pl-2 text-sm text-gray-200 capitalize">{{ item.soilType }}</td>
                        <td class="py-2 pr-2 text-right text-sm font-semibold text-blue-300">{{ item.count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SoilTypeDistribution } from '~/types/api/analytics';

defineProps<{
    data: SoilTypeDistribution[] | null | undefined;
}>();
</script>
