<template>
    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg">
        <h3 class="text-lg font-semibold text-white mb-4">Recent Activities</h3>
        <ul v-if="activities && activities.length > 0" class="space-y-4">
            <li v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
                <div
                    class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    :class="getActivityIcon(activity).bg"
                >
                    <component :is="getActivityIcon(activity).icon" class="h-5 w-5 text-white" />
                </div>
                <div class="flex-1">
                    <p class="text-sm text-white">{{ getActivityTitle(activity) }}</p>
                    <p class="text-xs text-gray-400">
                        {{ formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }) }}
                    </p>
                </div>
            </li>
        </ul>
        <div v-else class="text-center text-gray-400 py-8">
            No recent activities
        </div>
    </div>
</template>

<script setup lang="ts">
import { BuildingOffice2Icon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { formatDistanceToNow } from 'date-fns';
import type { RecentActivity } from '~/types/api/analytics';

defineProps<{
    activities: RecentActivity[];
}>();

const getActivityIcon = (activity: RecentActivity) => {
    if (activity.type === 'INFRASTRUCTURE') {
        return { icon: BuildingOffice2Icon, bg: 'bg-blue-500' };
    }
    return { icon: ExclamationTriangleIcon, bg: 'bg-red-500' };
};

const getActivityTitle = (activity: RecentActivity) => {
    if (activity.type === 'INFRASTRUCTURE') {
        return `New ${activity.category?.toLowerCase()} added: ${activity.name}`;
    }
    return `New accident recorded with ${activity.severity?.toLowerCase()} severity.`;
};
</script>
