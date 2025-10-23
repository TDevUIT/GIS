<template>
    <div v-if="infra" :class="{ 'grid grid-cols-1 lg:grid-cols-2 gap-8': infra.images && infra.images.length > 0 }">
        <div>
            <ul class="space-y-3 text-sm">
                <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span class="font-semibold text-gray-400">Name</span>
                    <span class="text-white font-medium text-right">{{ infra.name }}</span>
                </li>
                <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span class="font-semibold text-gray-400">Category</span>
                    <UiCategoryBadge :category="infra.category" />
                </li>
                <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span class="font-semibold text-gray-400">Address</span>
                    <span class="text-white text-right">{{ infra.address || 'N/A' }}</span>
                </li>

                <template v-if="infra.category === 'SCHOOL' && infra.school">
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">School Level</span>
                        <span class="text-white text-right capitalize">{{ infra.school.level?.replace('_', ' ').toLowerCase() || 'N/A' }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Student Capacity</span>
                        <span class="text-white text-right">{{ infra.school.studentCapacity?.toLocaleString() ?? 'N/A' }}</span>
                    </li>
                </template>

                <template v-if="infra.category === 'HOSPITAL' && infra.hospital">
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Hospital Type</span>
                        <span class="text-white text-right capitalize">{{ infra.hospital.type?.replace('_', ' ').toLowerCase() || 'N/A' }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Bed Capacity</span>
                        <span class="text-white text-right">{{ infra.hospital.bedCapacity?.toLocaleString() ?? 'N/A' }}</span>
                    </li>
                </template>

                <template v-if="infra.category === 'MARKET' && infra.market">
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Market Type</span>
                        <span class="text-white text-right capitalize">{{ infra.market.type?.toLowerCase() || 'N/A' }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Stall Count</span>
                        <span class="text-white text-right">{{ infra.market.stallCount?.toLocaleString() ?? 'N/A' }}</span>
                    </li>
                </template>

                <template v-if="infra.category === 'PARK' && infra.park">
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Area (m²)</span>
                        <span class="text-white text-right">{{ infra.park.area?.toLocaleString() ?? 'N/A' }}</span>
                    </li>
                </template>

                <template v-if="infra.category === 'UTILITY' && infra.utility">
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Utility Type</span>
                        <span class="text-white text-right capitalize">{{ infra.utility.type?.replace('_', ' ').toLowerCase() || 'N/A' }}</span>
                    </li>
                    <li class="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span class="font-semibold text-gray-400">Capacity</span>
                        <span class="text-white text-right">{{ infra.utility.capacity?.toLocaleString() ?? 'N/A' }}</span>
                    </li>
                </template>

                <li class="flex justify-between items-center pt-2">
                    <span class="font-semibold text-gray-400">Last Updated</span>
                    <span class="text-white text-right">{{ new Date(infra.updatedAt).toLocaleString('en-GB') }}</span>
                </li>
            </ul>
        </div>

        <div v-if="infra.images && infra.images.length > 0" class="flex items-center justify-center">
            <UiImageCarousel :images="infra.images" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Infrastructure } from '~/types/api/infrastructure';

defineProps<{
    infra: Infrastructure | null;
}>();
</script>
