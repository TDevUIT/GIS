<template>
    <div class="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/50">
        <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-800">
                <tr>
                    <th
                        v-for="column in columns"
                        :key="column.key"
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                    >
                        {{ column.label }}
                    </th>
                    <th v-if="hasActions" scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/50 bg-gray-900/50">
                <tr v-if="data.length === 0">
                    <td
                        :colspan="columns.length + (hasActions ? 1 : 0)"
                        class="px-6 py-8 text-center text-gray-500"
                    >
                        No data available.
                    </td>
                </tr>
                <tr
                    v-for="item in data"
                    :key="item.id"
                    class="cursor-pointer transition-colors"
                    :class="selectedId === item.id ? 'bg-blue-600/20' : 'hover:bg-gray-800/60'"
                    @click="$emit('row-click', item)"
                >
                    <td
                        v-for="column in columns"
                        :key="column.key"
                        class="whitespace-nowrap px-6 py-4 text-sm text-gray-300"
                    >
                        <slot
                            :name="`cell-${column.key}`"
                            :item="item"
                            :value="item[column.key]"
                        >
                            {{ item[column.key] }}
                        </slot>
                    </td>
                    <td
                        v-if="hasActions"
                        class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                    >
                        <slot name="actions" :item="item" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue';

export interface DataTableColumn {
    key: string;
    label: string;
}

defineProps<{
    columns: DataTableColumn[];
    data: any[];
    selectedId?: string | null;
}>();

defineEmits(['row-click']);

const slots = useSlots();
const hasActions = computed(() => !!slots.actions);
</script>
