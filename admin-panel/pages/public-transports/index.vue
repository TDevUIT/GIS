<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Public Transport Dashboard</h1>
                <p class="mt-1 text-sm text-gray-400">Manage and analyze the public transport network.</p>
            </div>
             <button @click="router.push('/public-transports/create')" class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                <PlusIcon class="h-5 w-5" />
                <span>Add New Route</span>
            </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="lg:col-span-1 h-80">
                <FeaturesPublicTransportsTransportAnalyticsChart
                    title="Routes by Mode"
                    label="Number of Routes"
                    :chart-labels="analyticsData.summary?.labels || []"
                    :chart-values="analyticsData.summary?.values || []"
                />
            </div>
            <div class="lg:col-span-1 h-80">
                <FeaturesPublicTransportsTransportAnalyticsChart
                    title="Capacity by Mode"
                    label="Total Passenger Capacity"
                    :chart-labels="analyticsData.capacity?.labels || []"
                    :chart-values="analyticsData.capacity?.values || []"
                />
            </div>
             <div class="lg:col-span-1 h-80">
                <FeaturesPublicTransportsFrequentRoutesTable :data="analyticsData.frequentRoutes" />
            </div>
        </div>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex-grow overflow-y-auto">
                    <UiDataTable
                        :columns="columns"
                        :data="allRoutes"
                        :selected-id="selectedRoute?.id"
                        @row-click="handleRowClick"
                    >
                        <template #cell-mode="{ value }">
                            <FeaturesPublicTransportsTransportModeBadge :mode="value" />
                        </template>
                         <template #cell-frequencyMin="{ value }">
                           {{ value ? `${value} min` : 'N/A' }}
                        </template>
                        <template #actions="{ item }">
                            <div class="flex items-center justify-end gap-3">
                                <button @click.stop="router.push(`/public-transports/${item.id}`)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                    <PencilSquareIcon class="h-5 w-5" />
                                </button>
                                <button @click.stop="handleDelete(item.id, item.routeName)" class="text-red-400 hover:text-red-300" title="Delete">
                                    <TrashIcon class="h-5 w-5" />
                                </button>
                            </div>
                        </template>
                    </UiDataTable>
                </div>
            </div>

            <div class="xl:col-span-2 flex flex-col gap-8">
                <div class="relative h-[40vh] xl:h-auto xl:flex-grow">
                    <ClientOnly>
                        <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="11" class="h-full">
                            <LGeoJson
                                v-if="routesGeoJson"
                                :key="geoJsonKey"
                                :geojson="routesGeoJson"
                                :options-style="geoJsonStyleFunction"
                                @click="onLineClick"
                            />
                        </UiLeafletMap>
                        <template #fallback>
                            <div class="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">Loading Map...</div>
                        </template>
                    </ClientOnly>
                </div>

                <div class="h-[40vh] xl:h-auto xl:flex-grow">
                     <UiDataDetailView title="Route Details" :item="selectedRoute" @close="selectedRoute = null">
                        <template #default="{ item }">
                            <ul class="space-y-3 text-sm">
                                <li class="flex justify-between border-b border-gray-700 pb-2"><span class="font-semibold text-gray-400">Route Name</span><span class="text-white font-medium text-right">{{ item.routeName }}</span></li>
                                <li class="flex justify-between"><span class="font-semibold text-gray-400">Mode</span><FeaturesPublicTransportsTransportModeBadge :mode="item.mode" /></li>
                                <li class="flex justify-between"><span class="font-semibold text-gray-400">District</span><span class="text-white font-medium">{{ item.districtName }}</span></li>
                                <li class="flex justify-between"><span class="font-semibold text-gray-400">Capacity</span><span class="text-white font-medium">{{ item.capacity?.toLocaleString() ?? 'N/A' }} passengers</span></li>
                                <li class="flex justify-between"><span class="font-semibold text-gray-400">Stops</span><span class="text-white font-medium">{{ item.stopsCount ?? 'N/A' }}</span></li>
                                <li class="flex justify-between"><span class="font-semibold text-gray-400">Frequency</span><span class="text-white font-medium">{{ item.frequencyMin ? `${item.frequencyMin} min/trip` : 'N/A' }}</span></li>
                                <li class="flex justify-between"><span class="font-semibold text-gray-400">Operating Hours</span><span class="text-white font-medium">{{ item.operatingHours || 'N/A' }}</span></li>
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
import L from 'leaflet';
import { getTransportLineStyle } from '~/utils/transportStyles';
import { TransportMode } from '~/types/api/shared';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { District } from '~/types/api/district';
import type { PublicTransport } from '~/types/api/public-transport';
import type { MostFrequentRoute, PublicTransportCapacityByMode, PublicTransportSummaryByMode } from '~/types/api/analytics';
import type { FeatureCollection } from 'geojson';

const { LGeoJson } = await import('@vue-leaflet/vue-leaflet');
useHead({ title: 'Public Transport' });

const { $api } = useNuxtApp();
const router = useRouter();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const filterMode = ref('');
const selectedDistrictId = ref('');
const districtOptions = ref<{ label: string; value: string }[]>([]);
const allRoutes = ref<PublicTransport[]>([]);
const selectedRoute = ref<PublicTransport | null>(null);
const mapRef = ref();
const mapCenter = ref<[number, number]>([10.7769, 106.7009]);

const transportModeOptions = [
    { label: 'All Modes', value: '' },
    ...Object.values(TransportMode).map(mode => ({ label: mode, value: mode }))
];

const analyticsData = reactive({
    summary: null as { labels: TransportMode[]; values: number[] } | null,
    capacity: null as { labels: TransportMode[]; values: number[] } | null,
    frequentRoutes: null as MostFrequentRoute[] | null
});

useAsyncData('districts-for-filter', async () => {
    return [];
});

const { refresh: refreshAllData } = useAsyncData('public-transports-data', async () => {
    selectedRoute.value = null;
    const [routesRes, summaryRes, capacityRes, frequentRes] = await Promise.all([
        $api.publicTransports.getAll({
            districtId: selectedDistrictId.value || undefined,
            mode: filterMode.value || undefined
        }),
        $api.analytics.getPublicTransportSummaryByMode(),
        $api.analytics.getPublicTransportCapacityByMode(),
        $api.analytics.getMostFrequentRoutes()
    ]);

    allRoutes.value = (routesRes.data.data || []).map((r: any) => ({
        ...r,
        geom: typeof r.geom === 'string' ? JSON.parse(r.geom) : r.geom
    }));

    const summaryData = summaryRes.data.data || [];
    analyticsData.summary = {
        labels: summaryData.map((d: any) => d.mode),
        values: summaryData.map((d: any) => d.routeCount)
    };

    const capacityData = capacityRes.data.data || [];
    analyticsData.capacity = {
        labels: capacityData.map((d: any) => d.mode),
        values: capacityData.map((d: any) => d.totalCapacity)
    };

    analyticsData.frequentRoutes = frequentRes.data.data || [];
}, { watch: [selectedDistrictId, filterMode] });

const columns: DataTableColumn[] = [
    { key: 'routeName', label: 'Route Name' },
    { key: 'mode', label: 'Mode' },
    { key: 'frequencyMin', label: 'Freq.' }
];

const routesGeoJson = computed<FeatureCollection | null>(() => {
    if (!allRoutes.value.length) return null;
    return {
        type: 'FeatureCollection',
        features: allRoutes.value.filter(r => r.geom).map(r => ({
            type: 'Feature',
            properties: { id: r.id, mode: r.mode },
            geometry: r.geom as any
        }))
    };
});

const geoJsonKey = computed(() => `${selectedDistrictId.value}-${filterMode.value}-${selectedRoute.value?.id}`);

function geoJsonStyleFunction(feature: any) {
    const isSelected = selectedRoute.value?.id === feature?.properties.id;
    return getTransportLineStyle(feature?.properties.mode, isSelected);
}

function handleRowClick(route: PublicTransport) {
    selectedRoute.value = selectedRoute.value?.id === route.id ? null : route;
}

function onLineClick(event: any) {
    const route = allRoutes.value.find(r => r.id === event.layer.feature.properties.id);
    if (route) handleRowClick(route);
}

async function handleDelete(id: string, name: string) {
    const result = await confirmDelete(`route "${name}"`);
    if (result.isConfirmed) {
        try {
            await $api.publicTransports.remove(id);
            toastSuccess('Route has been deleted.');
            await refreshAllData();
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}

watch(selectedRoute, (newSelection) => {
    if (!newSelection || !newSelection.geom) return;
    const map = mapRef.value?.mapObject;
    if (!map) return;
    const geoJsonLayer = L.geoJSON(newSelection.geom as any);
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
});
</script>
