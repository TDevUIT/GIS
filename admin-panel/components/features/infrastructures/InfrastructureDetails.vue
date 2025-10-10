<template>
    <ul v-if="infra" class="space-y-3 text-sm">
        <li class="flex justify-between border-b border-gray-700 pb-3">
            <span class="font-semibold text-gray-400">Name</span>
            <span class="text-white font-medium text-right">{{ infra.name }}</span>
        </li>
        <li class="flex justify-between border-b border-gray-700 pb-3">
            <span class="font-semibold text-gray-400">Category</span>
            <UiCategoryBadge :category="infra.category" />
        </li>
        <li class="flex justify-between border-b border-gray-700 pb-3">
            <span class="font-semibold text-gray-400">Address</span>
            <span class="text-white text-right">{{ infra.address || 'N/A' }}</span>
        </li>
        <li class="flex justify-between border-b border-gray-700 pb-3">
            <span class="font-semibold text-gray-400">District</span>
            <span class="text-white text-right">{{ infra.districtName }}</span>
        </li>
        <template v-if="infra.category === 'HOSPITAL' && infra.details">
            <li class="flex justify-between border-b border-gray-700 pb-3">
                <span class="font-semibold text-gray-400">Hospital Type</span>
                <span class="text-white text-right">{{ infra.details.type || 'N/A' }}</span>
            </li>
            <li class="flex justify-between border-b border-gray-700 pb-3">
                <span class="font-semibold text-gray-400">Bed Capacity</span>
                <span class="text-white text-right">{{ infra.details.bedCapacity ?? 'N/A' }}</span>
            </li>
        </template>
        <template v-if="infra.category === 'MARKET' && infra.details">
            <li class="flex justify-between border-b border-gray-700 pb-3">
                <span class="font-semibold text-gray-400">Market Type</span>
                <span class="text-white text-right">{{ infra.details.marketType || 'N/A' }}</span>
            </li>
            <li class="flex justify-between border-b border-gray-700 pb-3">
                <span class="font-semibold text-gray-400">Stall Count</span>
                <span class="text-white text-right">{{ infra.details.stallCount ?? 'N/A' }}</span>
            </li>
        </template>
        <template v-if="infra.category === 'PARK' && infra.details">
            <li class="flex justify-between border-b border-gray-700 pb-3">
                <span class="font-semibold text-gray-400">Area (m²)</span>
                <span class="text-white text-right">{{ infra.details.area?.toLocaleString() ?? 'N/A' }}</span>
            </li>
        </template>
        <li class="flex justify-between pt-2">
            <span class="font-semibold text-gray-400">Last Updated</span>
            <span class="text-white text-right">{{ new Date(infra.updatedAt).toLocaleString('en-GB') }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { InfraCategory } from '~/types/api/shared';

interface InfrastructureDetailItem {
    id: string;
    name: string;
    address: string;
    category: InfraCategory;
    districtName: string;
    updatedAt: string;
    details: {
        type?: string | null;
        bedCapacity?: number | null;
        marketType?: string | null;
        stallCount?: number | null;
        area?: number | null;
    } | null;
}

defineProps<{
    infra: InfrastructureDetailItem | null;
}>();
</script>
