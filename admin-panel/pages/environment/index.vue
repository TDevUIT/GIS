<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-white">Environment Monitoring</h1>
                    <p class="mt-1 text-sm text-gray-400">Manage and analyze air and water quality data.</p>
                </div>
                <div v-if="districtOptions.length > 1">
                    <select v-model="selectedDistrictId" class="form-select bg-gray-800 border-gray-600 text-white rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option v-for="option in districtOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>
            <button @click="router.push('/environment/create')" class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                <PlusIcon class="h-5 w-5" />
                <span>Add New Record</span>
            </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="lg:col-span-1 h-80">
                <FeaturesEnvironmentRankingTable
                    title="Air Quality Ranking (by PM2.5)"
                    value-label="Avg. PM2.5"
                    :data="airRanking"
                />
            </div>
            <div class="lg:col-span-1 h-80">
                <FeaturesEnvironmentRankingTable
                    title="Water Quality Ranking (by Contamination)"
                    value-label="Avg. Index"
                    :data="waterRanking"
                />
            </div>
        </div>

        <div v-if="selectedDistrictId" class="mb-6 h-80">
            <FeaturesEnvironmentHistoryChart
                :title="chartTitle"
                :chart-data="environmentChartData"
            />
        </div>
        <div v-else class="mb-6 h-80 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center justify-center">
            <p class="text-gray-500">Please select a district to view historical data.</p>
        </div>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-700">
                        <button @click="activeTab = 'air'" :class="activeTab === 'air' ? 'btn-tab-active' : 'btn-tab'">Air</button>
                        <button @click="activeTab = 'water'" :class="activeTab === 'water' ? 'btn-tab-active' : 'btn-tab'">Water</button>
                    </div>
                </div>
                
                <div class="flex-grow flex flex-col min-h-0">
                    <div class="overflow-y-auto">
                        <UiDataTable
                            v-if="!pending"
                            :columns="activeColumns"
                            :data="paginatedData"
                            :selected-id="selectedRecord?.id"
                            @row-click="handleRowClick"
                        >
                            <template #cell-level="{ value }">
                                <FeaturesEnvironmentQualityLevelBadge :level="value" />
                            </template>
                            <template #cell-recordedAt="{ value }">
                                {{ new Date(value).toLocaleString('en-GB') }}
                            </template>
                            <template #actions="{ item }">
                                <div class="flex items-center justify-end gap-3">
                                    <button @click.stop="router.push(`/environment/${item.id}?type=${activeTab}`)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click.stop="handleDelete(item.id, item.districtName, item.recordedAt)" class="text-red-400 hover:text-red-300" title="Delete">
                                        <TrashIcon class="h-5 w-5" />
                                    </button>
                                </div>
                            </template>
                        </UiDataTable>
                        <div v-else class="text-center text-gray-500 py-10">Loading data...</div>
                    </div>

                    <div v-if="!pending && totalPages > 1" class="flex-shrink-0 flex items-center justify-between mt-4 px-2">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
                        <span class="text-sm text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>
                        <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
                    </div>
                </div>
            </div>

            <div class="xl:col-span-2 flex flex-col gap-8">
                <div class="relative h-full">
                    <ClientOnly>
                        <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="12" class="h-full">
                            <LMarkerClusterGroup>
                                <LCircleMarker
                                    v-for="record in paginatedData"
                                    :key="record.id"
                                    :lat-lng="record.geom.coordinates.slice().reverse()"
                                    :radius="selectedRecord?.id === record.id ? 12 : 8"
                                    :color="getQualityMarkerColor(record.level)"
                                    :fill-color="getQualityMarkerColor(record.level)"
                                    :fill-opacity="0.8"
                                    @click="handleRowClick(record)"
                                >
                                    <LPopup>
                                        <div class="text-sm">
                                            <p><strong>District:</strong> {{ record.districtName }}</p>
                                            <p v-if="record.pm25 !== null && record.pm25 !== undefined"><strong>PM2.5:</strong> {{ record.pm25 }}</p>
                                            <p v-if="record.ph !== null && record.ph !== undefined"><strong>pH:</strong> {{ record.ph }}</p>
                                            <p><strong>Level:</strong> {{ record.level }}</p>
                                        </div>
                                    </LPopup>
                                </LCircleMarker>
                            </LMarkerClusterGroup>
                        </UiLeafletMap>
                        <template #fallback>
                            <div class="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                                Loading Map...
                            </div>
                        </template>
                    </ClientOnly>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { getQualityMarkerColor } from '~/utils/environmentStyles';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { AirQuality } from '~/types/api/air-quality';
import type { WaterQuality } from '~/types/api/water-quality';
import type { District } from '~/types/api/district';
import type { AirQualityHistoryPoint, WaterQualityHistoryPoint } from '~/types/api/analytics';

const { LCircleMarker, LPopup } = await import('@vue-leaflet/vue-leaflet');
const { LMarkerClusterGroup } = await import('vue-leaflet-markercluster');
import 'vue-leaflet-markercluster/dist/style.css';

useHead({ title: 'Environment Monitoring' });

type RecordType = 'air' | 'water';
type EnvironmentRecord = AirQuality | WaterQuality;

const { $api } = useNuxtApp();
const router = useRouter();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const activeTab = ref<RecordType>('air');
const selectedDistrictId = ref<string>('');
const districtOptions = ref<{ label: string; value: string }[]>([]);
const selectedRecord = ref<EnvironmentRecord | null>(null);
const mapRef = ref();
const mapCenter = ref<[number, number]>([10.7769, 106.7009]);

const currentPage = ref(1);
const itemsPerPage = 5;

const { data: pageData, pending, refresh: refreshAllData } = useAsyncData('environment-page-data', async () => {
    selectedRecord.value = null;

    const [districtsRes, airRes, waterRes, airRankRes, waterRankRes] = await Promise.all([
        $api.districts.getAll(),
        $api.airQualities.getAll(),
        $api.waterQualities.getAll(),
        $api.analytics.getAirQualityRankingByDistrict(),
        $api.analytics.getWaterQualityRankingByDistrict()
    ]);

    const districts = (districtsRes.data.data || []);
    districtOptions.value = [
        { label: 'All Districts', value: '' },
        ...districts.map((d: District) => ({ label: d.name, value: d.id }))
    ];

    if (!selectedDistrictId.value && districts.length > 0) {
        selectedDistrictId.value = districts[0].id;
    }

    const parseGeom = (r: any) => ({ ...r, geom: typeof r.geom === 'string' ? JSON.parse(r.geom) : r.geom });

    const sortDescByDate = (a: EnvironmentRecord, b: EnvironmentRecord) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();

    return {
        air: (airRes.data.data || []).map(parseGeom).sort(sortDescByDate),
        water: (waterRes.data.data || []).map(parseGeom).sort(sortDescByDate),
        airRanking: (airRankRes.data.data || []).map(d => ({ ...d, value: parseFloat(d.avgPm25) })),
        waterRanking: (waterRankRes.data.data || []).map(d => ({ ...d, value: parseFloat(d.avgContaminationIndex) }))
    };
});

const { data: historyData, pending: historyPending } = useAsyncData(
    'environment-history-data',
    async () => {
        if (!selectedDistrictId.value) return null;
        if (activeTab.value === 'air') {
            const res = await $api.analytics.getAirQualityHistory(selectedDistrictId.value);
            return res.data.data;
        } else {
            const res = await $api.analytics.getWaterQualityHistory(selectedDistrictId.value);
            return res.data.data;
        }
    },
    { watch: [selectedDistrictId, activeTab] }
);

const airQualityData = computed(() => pageData.value?.air || []);
const waterQualityData = computed(() => pageData.value?.water || []);
const airRanking = computed(() => pageData.value?.airRanking || []);
const waterRanking = computed(() => pageData.value?.waterRanking || []);

const airColumns: DataTableColumn[] = [
    { key: 'districtName', label: 'District' },
    { key: 'pm25', label: 'PM2.5' },
    { key: 'level', label: 'Level' },
    { key: 'recordedAt', label: 'Time' }
];

const waterColumns: DataTableColumn[] = [
    { key: 'districtName', label: 'District' },
    { key: 'ph', label: 'pH' },
    { key: 'turbidity', label: 'Turbidity' },
    { key: 'level', label: 'Level' },
    { key: 'recordedAt', label: 'Time' }
];

const activeColumns = computed(() => (activeTab.value === 'air' ? airColumns : waterColumns));
const activeData = computed(() => (activeTab.value === 'air' ? airQualityData.value : waterQualityData.value));

const filteredActiveData = computed(() => {
    if (!selectedDistrictId.value) {
        return activeData.value;
    }
    return activeData.value.filter((record: EnvironmentRecord) => record.districtId === selectedDistrictId.value);
});

const totalPages = computed(() => Math.ceil(filteredActiveData.value.length / itemsPerPage));

const paginatedData = computed(() => {
    if (!filteredActiveData.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredActiveData.value.slice(start, end);
});

const environmentChartData = computed(() => {
    const items = historyData.value || [];

    if (activeTab.value === 'air' && items.length > 0) {
        return {
            labels: items.map((item: AirQualityHistoryPoint) => new Date(item.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })),
            datasets: [
                {
                    label: 'Avg PM2.5',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#EF4444',
                    pointBackgroundColor: '#EF4444',
                    data: items.map((item: AirQualityHistoryPoint) => Number(item.avgPm25)),
                    tension: 0.3,
                },
                {
                    label: 'Avg CO2',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3B82F6',
                    pointBackgroundColor: '#3B82F6',
                    data: items.map((item: AirQualityHistoryPoint) => Number(item.avgCo2)),
                    tension: 0.3,
                },
            ]
        }
    }

    if (activeTab.value === 'water' && items.length > 0) {
        return {
            labels: items.map((item: WaterQualityHistoryPoint) => new Date(item.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })),
            datasets: [
                {
                    label: 'Avg pH',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderColor: '#22C55E',
                    pointBackgroundColor: '#22C55E',
                    data: items.map((item: WaterQualityHistoryPoint) => Number(item.avgPh)),
                    tension: 0.3,
                },
                {
                    label: 'Avg Turbidity',
                    backgroundColor: 'rgba(234, 179, 8, 0.2)',
                    borderColor: '#EAB308',
                    pointBackgroundColor: '#EAB308',
                    data: items.map((item: WaterQualityHistoryPoint) => Number(item.avgTurbidity)),
                    tension: 0.3,
                },
            ]
        }
    }
    return { labels: [], datasets: [{ data: [] }] };
});

const chartTitle = computed(() => {
    const selectedDistrictName = districtOptions.value.find(d => d.value === selectedDistrictId.value)?.label || 'All Districts';
    const type = activeTab.value === 'air' ? 'Air' : 'Water';
    return `${type} Quality History for ${selectedDistrictName}`;
});

function handleRowClick(record: EnvironmentRecord) {
    if (selectedRecord.value?.id === record.id) {
        selectedRecord.value = null;
    } else {
        selectedRecord.value = record;
        if (record?.geom?.coordinates) {
            const map = mapRef.value?.mapObject;
            if (map) {
                map.flyTo(record.geom.coordinates.slice().reverse(), 15);
            }
        }
    }
}

async function handleDelete(id: string, name: string, date: string) {
    const api = activeTab.value === 'air' ? $api.airQualities : $api.waterQualities;
    const result = await confirmDelete(`record at ${name} on ${new Date(date).toLocaleDateString()}`);
    if (result.isConfirmed) {
        try {
            await api.remove(id);
            toastSuccess('Record deleted.');
            await refreshAllData();
        } catch (err: any) {
            toastError('Deletion failed');
        }
    }
}

watch([activeTab, selectedDistrictId], () => {
    currentPage.value = 1;
    selectedRecord.value = null;
});

watch(selectedDistrictId, async (newDistrictId) => {
    selectedRecord.value = null;
    if (!newDistrictId) {
        mapRef.value?.mapObject.flyTo(mapCenter.value, 12);
    } else {
        const firstRecordOfDistrict = activeData.value.find(r => r.districtId === newDistrictId);
        if (firstRecordOfDistrict?.geom?.coordinates) {
            mapRef.value?.mapObject.flyTo(firstRecordOfDistrict.geom.coordinates.slice().reverse(), 14);
        }
    }
});
</script>

<style scoped>
.btn-tab { @apply px-4 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-700 w-full transition-colors; }
.btn-tab-active { @apply px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md w-full; }
.pagination-btn { @apply px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors; }
</style>
