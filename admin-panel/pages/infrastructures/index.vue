<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Infrastructures Management</h1>
                <p class="mt-1 text-sm text-gray-400">Manage infrastructure points within each district.</p>
            </div>
            <button
                @click="handleAdd"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add Infrastructure</span>
            </button>
        </header>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-grow">
                        <label class="block text-xs font-medium text-gray-400 mb-1">Search</label>
                        <UiSearchInput v-model="searchQuery" placeholder="Search by name..." />
                    </div>
                    <div class="flex-grow">
                        <label class="block text-xs font-medium text-gray-400 mb-1">Filter by District</label>
                        <UiAppDropdown
                            v-if="districtOptions.length > 0"
                            v-model="selectedDistrictId"
                            :options="districtOptions"
                            placeholder="All Districts"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="flex-grow flex flex-col min-h-0">
                    <div class="flex-grow overflow-y-auto">
                        <UiDataTable
                            :columns="columns"
                            :data="paginatedInfrastructures"
                            :selected-id="selectedInfrastructure?.id"
                            :hovered-id="hoveredInfrastructureId"
                            @row-click="handleRowClick"
                            @row-hover="id => hoveredInfrastructureId = id"
                        >
                            <template #cell-category="{ item }">
                                <UiCategoryBadge :category="item.category" />
                            </template>
                            <template #actions="{ item }">
                                <div class="flex items-center justify-end gap-3">
                                    <button @click.stop="handleEdit(item.id)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click.stop="handleDelete(item.id, item.name)" class="text-red-400 hover:text-red-300" title="Delete">
                                        <TrashIcon class="h-5 w-5" />
                                    </button>
                                </div>
                            </template>
                        </UiDataTable>
                    </div>

                    <div v-if="totalPages > 1" class="flex-shrink-0 flex items-center justify-between mt-4">
                        <span class="text-sm text-gray-400">
                            Page {{ currentPage }} of {{ totalPages }}
                        </span>
                        <div class="flex items-center gap-2">
                            <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
                            <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="xl:col-span-2 flex flex-col gap-8">
                <div class="h-[50vh] xl:h-auto xl:flex-grow">
                    <FeaturesInfrastructuresInfrastructureMap
                        :infrastructures="searchedInfrastructures"
                        :selected-id="selectedInfrastructure?.id"
                        :hovered-id="hoveredInfrastructureId"
                        @marker-click="handleMarkerClick"
                        @marker-hover="id => hoveredInfrastructureId = id"
                    />
                </div>

                <div class="h-[30vh] xl:h-auto xl:flex-grow">
                    <UiDataDetailView
                        title="Infrastructure Details"
                        :item="selectedInfrastructure"
                        @close="selectedInfrastructure = null"
                    >
                        <template #default="{ item }">
                            <FeaturesInfrastructuresInfrastructureDetails :infra="item" />
                        </template>
                    </UiDataDetailView>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { District } from '~/types/api/district';
import type { Infrastructure } from '~/types/api/infrastructure';

useHead({ title: 'Infrastructures Management' });

const { $api } = useNuxtApp();
const router = useRouter();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const searchQuery = ref('');
const selectedDistrictId = ref('');
const allInfrastructures = ref<Infrastructure[]>([]);
const selectedInfrastructure = ref<Infrastructure | null>(null);
const districtOptions = ref<{ label: string; value: string }[]>([]);
const hoveredInfrastructureId = ref<string | null>(null);

const currentPage = ref(1);
const itemsPerPage = 5;

useAsyncData('districts-for-filter', async () => {
    const response = await $api.districts.getAll();
    const districtData = response.data.data;
    if (Array.isArray(districtData)) {
        districtOptions.value = [
            { label: 'All Districts', value: '' },
            ...districtData.map((d: District) => ({ label: d.name, value: d.id }))
        ];
    }
    return districtData;
});

const { refresh: refreshInfrastructures } = useAsyncData(
    'infrastructures-list',
    async () => {
        const response = await $api.infrastructures.getAll({ districtId: selectedDistrictId.value || undefined });
        allInfrastructures.value = response.data.data || [];
        if (selectedInfrastructure.value && !allInfrastructures.value.some(i => i.id === selectedInfrastructure.value?.id)) {
            selectedInfrastructure.value = null;
        }
        return allInfrastructures.value;
    },
    { watch: [selectedDistrictId] }
);

const columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'districtName', label: 'District' }
];

const searchedInfrastructures = computed(() => {
    if (!searchQuery.value) return allInfrastructures.value;
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return allInfrastructures.value.filter(i => i.name.toLowerCase().includes(lowerCaseQuery));
});

const totalPages = computed(() => {
    return Math.ceil(searchedInfrastructures.value.length / itemsPerPage);
});

const paginatedInfrastructures = computed(() => {
    if (!searchedInfrastructures.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return searchedInfrastructures.value.slice(start, end);
});

function handleAdd() {
    router.push('/infrastructures/create');
}

function handleEdit(id: string) {
    router.push(`/infrastructures/${id}`);
}

async function handleDelete(id: string, name: string) {
    const result = await confirmDelete(name);
    if (result.isConfirmed) {
        try {
            await $api.infrastructures.remove(id);
            toastSuccess(`"${name}" has been deleted.`);
            if (selectedInfrastructure.value?.id === id) {
                selectedInfrastructure.value = null;
            }
            await refreshInfrastructures();
            if (paginatedInfrastructures.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
            }
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}

async function handleRowClick(infra: Infrastructure) {
    if (selectedInfrastructure.value?.id === infra.id) {
        selectedInfrastructure.value = null;
    } else {
        try {
            const response = await $api.infrastructures.getById(infra.id);
            selectedInfrastructure.value = response.data.data;
        } catch {
            toastError('Error', 'Could not fetch infrastructure details.');
            selectedInfrastructure.value = infra;
        }
    }
}

function handleMarkerClick(id: string) {
    const infra = allInfrastructures.value.find(i => i.id === id);
    if (infra) {
        handleRowClick(infra);
    }
}

watch([searchQuery, selectedDistrictId], () => {
    currentPage.value = 1;
});
</script>

<style scoped>
.pagination-btn {
    @apply px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
</style>
