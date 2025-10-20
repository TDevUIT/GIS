<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-4 h-full flex flex-col">
        <h3 class="text-base font-semibold text-white mb-3">{{ title }}</h3>
        <div class="flex-grow overflow-y-auto">
            <table class="min-w-full">
                <thead class="sticky top-0 bg-gray-800/50 backdrop-blur-sm">
                    <tr>
                        <th class="py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">District</th>
                        <th class="py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{{ valueLabel }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700/50">
                    <tr v-if="!data || data.length === 0">
                        <td colspan="2" class="py-4 text-center text-sm text-gray-500">No ranking data available.</td>
                    </tr>
                    <tr v-for="(item, index) in data" :key="item.districtCode" class="hover:bg-gray-700/30">
                        <td class="py-2 text-sm text-gray-200">
                           <span class="font-bold mr-2 text-red-400">{{ index + 1 }}.</span> {{ item.districtName }}
                        </td>
                        <td class="py-2 text-right text-sm font-bold text-orange-400">{{ item.value.toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
type RankingData = {
    districtName: string;
    districtCode: string;
    value: number;
}

defineProps<{
    title: string;
    valueLabel: string;
    data: RankingData[] | null | undefined;
}>();
</script>
