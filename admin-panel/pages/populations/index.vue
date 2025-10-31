<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Population Management</h1>
                <p class="mt-1 text-sm text-gray-400">View and manage population data by district and year.</p>
            </div>
            <button
                @click="handleAdd"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add Population Data</span>
            </button>
        </header>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
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
                    <div class="flex-grow">
                        <label class="block text-xs font-medium text-gray-400 mb-1">Filter by Year</label>
                        <UiAppDropdown
                            v-model="selectedYear"
                            :options="yearOptions"
                            placeholder="All Years"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="flex-grow flex flex-col min-h-0">
                    <div class="flex-grow overflow-y-auto">
                        <UiDataTable
                            :columns="columns"
                            :data="paginatedPopulations"
                            :selected-id="selectedPopulation?.id"
                            @row-click="handleRowClick"
                        >
                            <template #cell-districtName="{ item }">
                                {{ item.district?.name || 'N/A' }}
                            </template>
                            <template #cell-populationTotal="{ value }">
                                {{ value.toLocaleString() }}
                            </template>
                            <template #cell-householdsTotal="{ value }">
                                {{ value.toLocaleString() }}
                            </template>
                            <template #actions="{ item }">
                                <div class="flex items-center justify-end gap-3">
                                    <button @click.stop="handleEdit(item.id)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click.stop="handleDelete(item.id, item.district?.name, item.year)" class="text-red-400 hover:text-red-300" title="Delete">
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

            <div class="xl:col-span-2 flex flex-col gap-8 overflow-y-auto pr-2">
                <div v-if="!selectedPopulation" class="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                    <UsersIcon class="h-12 w-12 mb-4" />
                    <p class="font-semibold">No data selected</p>
                    <p class="text-sm">Click on a row in the table to view its details and charts.</p>
                </div>

                <template v-else>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FeaturesPopulationsStatCard label="Total Population" :value="selectedPopulation.populationTotal.toLocaleString()" :icon="UsersIcon" />
                        <FeaturesPopulationsStatCard label="Total Households" :value="selectedPopulation.householdsTotal.toLocaleString()" :icon="HomeModernIcon" />
                        <FeaturesPopulationsStatCard label="Data Year" :value="selectedPopulation.year" :icon="CalendarDaysIcon" />
                    </div>

                    <div class="h-[400px]">
                        <FeaturesPopulationsDemographicsPyramidChart :demographics="demographicsData" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="h-[300px]">
                            <FeaturesPopulationsHouseholdsDoughnutChart
                                title="By Housing Type"
                                :data="householdsData?.byHousingType"
                                label-key="housingType"
                            />
                        </div>
                        <div class="h-[300px]">
                            <FeaturesPopulationsHouseholdsDoughnutChart
                                title="By Income Level"
                                :data="householdsData?.byIncomeLevel"
                                label-key="incomeLevel"
                            />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon, UsersIcon, HomeModernIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { District } from '~/types/api/district';
import type { Population } from '~/types/api/population';
import type { DemographicsSummaryPoint, HouseholdsSummary } from '~/types/api/analytics';

useHead({ title: 'Population Management' });

const { $api } = useNuxtApp();
const router = useRouter();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const selectedDistrictId = ref('');
const selectedYear = ref<string>('');
const districtOptions = ref<{ label: string; value: string }[]>([]);
const allPopulations = ref<Population[]>([]);
const selectedPopulation = ref<Population | null>(null);
const demographicsData = ref<DemographicsSummaryPoint[] | undefined>();
const householdsData = ref<HouseholdsSummary | undefined>();

const currentPage = ref(1);
const itemsPerPage = 5;

const yearOptions = [
    { label: 'All Years', value: '' },
    ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => ({ label: year.toString(), value: year.toString() }))
];

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

const { refresh: refreshPopulations } = useAsyncData(
    'populations-list',
    async () => {
        const params: { districtId?: string; year?: number } = {};
        if (selectedDistrictId.value) params.districtId = selectedDistrictId.value;
        if (selectedYear.value) params.year = parseInt(selectedYear.value, 10);

        const response = await $api.populations.getAll(params);
        allPopulations.value = response.data.data || [];

        if (selectedPopulation.value && !allPopulations.value.some(p => p.id === selectedPopulation.value?.id)) {
            selectedPopulation.value = null;
        }
        return allPopulations.value;
    },
    { watch: [selectedDistrictId, selectedYear] }
);

const columns: DataTableColumn[] = [
    { key: 'districtName', label: 'District' },
    { key: 'year', label: 'Year' },
    { key: 'populationTotal', label: 'Total Pop.' },
    { key: 'householdsTotal', label: 'Total HH.' },
];

const totalPages = computed(() => Math.ceil(allPopulations.value.length / itemsPerPage));

const paginatedPopulations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allPopulations.value.slice(start, end);
});

watch(selectedPopulation, async (newSelection) => {
    if (newSelection?.id) {
        try {
            const [demoRes, houseRes] = await Promise.all([
                $api.analytics.getDemographicsSummary(newSelection.id),
                $api.analytics.getHouseholdsSummary(newSelection.id),
            ]);
            demographicsData.value = demoRes.data.data;
            householdsData.value = houseRes.data.data;
        } catch (e) {
            toastError('Failed to fetch chart data');
            demographicsData.value = undefined;
            householdsData.value = undefined;
        }
    } else {
        demographicsData.value = undefined;
        householdsData.value = undefined;
    }
});

async function handleRowClick(population: Population) {
    if (selectedPopulation.value?.id === population.id) {
        selectedPopulation.value = null;
        return;
    }
    try {
        const response = await $api.populations.getById(population.id);
        selectedPopulation.value = response.data.data;
    } catch {
        toastError('Error', 'Could not fetch population details.');
        selectedPopulation.value = population;
    }
}

function handleAdd() {
    router.push('/populations/create');
}

function handleEdit(id: string) {
    router.push(`/populations/${id}`);
}

async function handleDelete(id: string, districtName = 'N/A', year: number) {
    const result = await confirmDelete(`population data for ${districtName} in ${year}`);
    if (result.isConfirmed) {
        try {
            await $api.populations.remove(id);
            toastSuccess('Population data has been deleted.');
            if (selectedPopulation.value?.id === id) {
                selectedPopulation.value = null;
            }
            await refreshPopulations();
            if (paginatedPopulations.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
            }
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}

watch([selectedDistrictId, selectedYear], () => {
    currentPage.value = 1;
});
</script>

<style scoped>
.pagination-btn {
    @apply px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
</style>
