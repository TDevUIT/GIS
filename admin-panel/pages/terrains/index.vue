<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Terrain Analysis</h1>
                <p class="mt-1 text-sm text-gray-400">Analyze terrain data including elevation, slope, and soil type.</p>
            </div>
            <button
                @click="router.push('/terrains/create')"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add New Terrain Area</span>
            </button>
        </header>

        <div class="flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-800/50 p-4 rounded-lg flex flex-col">
                <h3 class="text-lg font-semibold text-white mb-3 flex-shrink-0">Terrain Summary by District</h3>
                <div class="flex-grow overflow-y-auto">
                    <UiDataTable :columns="summaryColumns" :data="analyticsData.summary || []" />
                </div>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-lg flex flex-col">
                <div class="flex-grow overflow-y-auto">
                    <FeaturesTerrainsSoilDistributionTable :data="analyticsData.soilDistribution || []" />
                </div>
            </div>
        </div>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-5 gap-6 min-h-0">
            <div class="xl:col-span-2 flex flex-col min-h-0 bg-gray-800/50 p-4 rounded-lg">
                <div class="flex-shrink-0 flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">All Terrain Areas</h3>
                    <UiSearchInput v-model="searchQuery" placeholder="Search by soil type..." />
                </div>
                <div class="flex-grow overflow-y-auto pr-2">
                    <UiDataTable
                        :columns="dataColumns"
                        :data="paginatedData"
                        :selected-id="selectedTerrain?.id"
                        @row-click="handleRowClick"
                    >
                        <template #actions="{ item }">
                            <div class="flex items-center justify-end gap-3">
                                <button
                                    @click.stop="router.push(`/terrains/${item.id}`)"
                                    class="text-blue-400 hover:text-blue-300"
                                    title="Edit"
                                >
                                    <PencilSquareIcon class="h-5 w-5" />
                                </button>
                                <button
                                    @click.stop="handleDelete(item.id, item.districtName)"
                                    class="text-red-400 hover:text-red-300"
                                    title="Delete"
                                >
                                    <TrashIcon class="h-5 w-5" />
                                </button>
                            </div>
                        </template>
                    </UiDataTable>
                </div>
                <div
                    v-if="totalPages > 1"
                    class="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-700"
                >
                    <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
                    <span class="text-sm text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
                </div>
            </div>

            <div class="xl:col-span-3 flex flex-col gap-6 min-h-0">
                <div class="relative flex-grow rounded-lg overflow-hidden">
                    <ClientOnly>
                        <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="12" class="h-full w-full">
                            <LGeoJson
                                v-if="terrainsGeoJSON"
                                :key="geoJsonKey"
                                :geojson="terrainsGeoJSON"
                                :options-style="styleFeature"
                                @add="onGeoJsonReady"
                            />
                        </UiLeafletMap>
                        <FeaturesTerrainsTerrainLegend
                            title="Elevation Level"
                            :items="legendItems"
                            class="absolute top-4 right-4 z-[1000]"
                        />
                        <template #fallback>
                            <div class="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500">
                                Loading Map...
                            </div>
                        </template>
                    </ClientOnly>
                </div>

                <div class="flex-shrink-0">
                    <UiDataDetailView title="Terrain Details" :item="selectedTerrain" @close="selectedTerrain = null">
                        <template #default="{ item }">
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                <li class="flex justify-between border-b border-gray-700 pb-2">
                                    <span class="font-semibold text-gray-400">District</span>
                                    <span class="text-white font-medium text-right">{{ item.districtName }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-2">
                                    <span class="font-semibold text-gray-400">Soil Type</span>
                                    <span class="text-white font-medium capitalize">{{ item.soilType || 'N/A' }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-2">
                                    <span class="font-semibold text-gray-400">Elevation</span>
                                    <span class="text-white font-medium">{{ item.elevation?.toFixed(2) ?? 'N/A' }} m</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-2">
                                    <span class="font-semibold text-gray-400">Slope</span>
                                    <span class="text-white font-medium">{{ item.slope?.toFixed(2) ?? 'N/A' }} °</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-2">
                                    <span class="font-semibold text-gray-400">Elevation Level</span>
                                    <span class="text-white font-medium">{{ item.elevationCategory }}</span>
                                </li>
                            </ul>
                        </template>
                    </UiDataDetailView>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { Terrain, ElevationCategory } from '~/types/api/terrain';
import type { TerrainSummaryByDistrict, SoilTypeDistribution } from '~/types/api/analytics';
import type { GeoJSON, FeatureCollection } from 'geojson';
import L from 'leaflet';

const { LGeoJson } = await import('@vue-leaflet/vue-leaflet');
useHead({ title: 'Terrain Analysis' });

const router = useRouter();
const { $api } = useNuxtApp();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const mapRef = ref();
const mapCenter = ref<[number, number]>([10.7769, 106.7009]);
const selectedTerrain = ref<Terrain | null>(null);
const searchQuery = ref('');
let geoJsonLayers: L.GeoJSON | null = null;

const analyticsData = reactive<{
    summary: TerrainSummaryByDistrict[] | null;
    soilDistribution: SoilTypeDistribution[] | null;
}>({ summary: null, soilDistribution: null });

const { data: allTerrains, pending, refresh: refreshAllData } = useAsyncData('terrains-data', async () => {
    const res = await $api.terrains.getAll();
    return extractData(res).map((t: any) => ({
        ...t,
        geom: typeof t.geom === 'string' ? JSON.parse(t.geom) : t.geom,
    }));
});

useAsyncData('terrains-analytics', async () => {
    const [summaryRes, soilRes] = await Promise.all([
        $api.analytics.getTerrainSummaryByDistrict(),
        $api.analytics.getSoilTypeDistribution(),
    ]);
    analyticsData.summary = extractData(summaryRes) || [];
    analyticsData.soilDistribution = extractData(soilRes) || [];
});

const filteredData = computed(() => {
    if (!allTerrains.value) return [];
    if (!searchQuery.value) return allTerrains.value;
    return allTerrains.value.filter((t) =>
        t.soilType?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.value.slice(start, end);
});

watch(searchQuery, () => {
    currentPage.value = 1;
});

const elevationColors: Record<ElevationCategory, string> = {
    VERY_LOW: '#313695',
    LOW: '#ABD9E9',
    MEDIUM: '#FFFFBF',
    HIGH: '#FDAE61',
    VERY_HIGH: '#A50026',
    UNKNOWN: '#CCCCCC',
};
const legendItems = [
    { color: elevationColors.VERY_HIGH, label: 'Very High' },
    { color: elevationColors.HIGH, label: 'High' },
    { color: elevationColors.MEDIUM, label: 'Medium' },
    { color: elevationColors.LOW, label: 'Low' },
    { color: elevationColors.VERY_LOW, label: 'Very Low' },
];

function styleFeature(feature?: GeoJSON.Feature<GeoJSON.Geometry, Terrain>) {
    const isSelected = selectedTerrain.value?.id === feature?.properties?.id;
    const category = feature?.properties?.elevationCategory;
    return {
        fillColor: category ? elevationColors[category] : elevationColors.UNKNOWN,
        weight: isSelected ? 3 : 1,
        opacity: 1,
        color: isSelected ? '#3B82F6' : 'white',
        fillOpacity: isSelected ? 0.9 : 0.7,
    };
}

const geoJsonKey = computed(() => selectedTerrain.value?.id);
const terrainsGeoJSON = computed<FeatureCollection | null>(() => {
    const data = allTerrains.value;
    if (!data || data.length === 0) return null;
    return {
        type: 'FeatureCollection',
        features: data.map((t) => ({
            type: 'Feature',
            properties: t,
            geometry: t.geom as any,
        })),
    };
});

function onGeoJsonReady(e: { target: L.GeoJSON }) {
    geoJsonLayers = e.target;
    geoJsonLayers.on('click', (ev: any) => {
        const featureProps = ev.layer.feature.properties;
        handleRowClick(featureProps);
    });
}

function handleRowClick(item: Terrain) {
    selectedTerrain.value = selectedTerrain.value?.id === item.id ? null : item;
}

watch(selectedTerrain, (newSelection, oldSelection) => {
    if (!geoJsonLayers) return;
    if (oldSelection) {
        geoJsonLayers.eachLayer((layer) => {
            if ((layer as any).feature.properties.id === oldSelection.id) {
                geoJsonLayers?.resetStyle(layer);
            }
        });
    }
    if (newSelection) {
        geoJsonLayers.eachLayer((layer) => {
            if ((layer as any).feature.properties.id === newSelection.id) {
                (layer as L.Path).setStyle({ weight: 3, color: '#3B82F6', fillOpacity: 0.9 });
                layer.bringToFront();
                const map = mapRef.value?.mapObject;
                if (map && typeof (layer as any).getBounds === 'function') {
                    map.flyToBounds((layer as any).getBounds(), { padding: [50, 50] });
                }
            }
        });
    }
});

const summaryColumns: DataTableColumn[] = [
    { key: 'districtName', label: 'District' },
    { key: 'avgElevation', label: 'Avg Elev. (m)' },
    { key: 'maxElevation', label: 'Max Elev. (m)' },
    { key: 'avgSlope', label: 'Avg Slope (°)' },
];
const dataColumns: DataTableColumn[] = [
    { key: 'elevation', label: 'Elev. (m)' },
    { key: 'slope', label: 'Slope (°)' },
    { key: 'soilType', label: 'Soil' },
];

async function handleDelete(id: string, districtName: string) {
    const result = await confirmDelete(`terrain area in "${districtName}"`);
    if (result.isConfirmed) {
        try {
            await $api.terrains.remove(id);
            toastSuccess('Terrain area has been deleted.');
            if (selectedTerrain.value?.id === id) {
                selectedTerrain.value = null;
            }
            await refreshAllData();
            if (paginatedData.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
            }
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}
</script>

<style scoped>
.pagination-btn {
    @apply px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
</style>
