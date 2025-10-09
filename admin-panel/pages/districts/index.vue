<template>
    <div class="space-y-8">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold text-white">Districts Management</h1>
                <p class="mt-1 text-sm text-gray-400">View, search, and manage all districts in the system.</p>
            </div>
            <button @click="handleAdd" class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                <PlusIcon class="h-5 w-5" />
                <span>Add District</span>
            </button>
        </header>
        <div v-if="pending" class="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 p-20 text-gray-400">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading districts...</span>
        </div>
        <div v-else-if="error" class="rounded-md bg-red-900/50 p-4 text-red-300">
            Failed to load districts: {{ error.message }}
        </div>
        <div v-else class="space-y-8">
            <div class="flex justify-end">
                <UiSearchInput v-model="searchQuery" placeholder="Search by name or code..." />
            </div>
            <UiDataTable :columns="columns" :data="filteredDistricts">
                <template #cell-areaKm2="{ value }">
                    {{ value ? `${value.toFixed(2)} km²` : 'N/A' }}
                </template>
                <template #cell-updatedAt="{ value }">
                    {{ new Date(value).toLocaleDateString('en-GB') }}
                </template>
                <template #actions="{ item }">
                    <div class="flex items-center justify-end gap-3">
                        <button @click="handleEdit(item.id)" class="text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                            <PencilSquareIcon class="h-5 w-5" />
                        </button>
                        <button @click="handleDelete(item.id, item.name)" class="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                            <TrashIcon class="h-5 w-5" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
            <div>
                <h2 class="text-xl font-semibold text-white mb-4">Districts Map</h2>
                <ClientOnly>
                    <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="11">
                        <LGeoJson v-if="allDistrictsGeoJson" :geojson="allDistrictsGeoJson" :options-style="geoJsonStyle" />
                    </UiLeafletMap>
                    <template #fallback>
                        <div class="h-[400px] w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                            Loading Map...
                        </div>
                    </template>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import { useSwal } from '~/composables/useSwal';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { District } from '~/types/api/district';
import type { FeatureCollection } from 'geojson';
import type { LatLngExpression } from 'leaflet';

const LGeoJson = (await import('@vue-leaflet/vue-leaflet')).LGeoJson;

useHead({ title: 'Districts Management' });

const { $api } = useNuxtApp();
const router = useRouter();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const { data: districts, pending, error, refresh: refreshDistricts } = useAsyncData('districts-list', async () => {
    const response = await $api.districts.getAll();
    return response.data.data;
});

const columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'areaKm2', label: 'Area' },
    { key: 'updatedAt', label: 'Last Updated' },
];

const searchQuery = ref('');
const filteredDistricts = computed(() => {
    if (!districts.value) return [];
    if (!searchQuery.value) return districts.value;
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return districts.value.filter((d: { name: string; code: string; }) => 
        d.name.toLowerCase().includes(lowerCaseQuery) || 
        d.code.toLowerCase().includes(lowerCaseQuery)
    );
});

function handleAdd() {
    router.push('/districts/create');
}

function handleEdit(id: string) {
    router.push(`/districts/${id}`);
}

async function handleDelete(id: string, name: string) {
    const result = await confirmDelete(name);
    if (result.isConfirmed) {
        try {
            await $api.districts.remove(id);
            toastSuccess(`District "${name}" has been deleted.`);
            await refreshDistricts();
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}

const mapRef = ref();
const mapCenter = ref<[number, number]>([10.7769, 106.7009]);

const geoJsonStyle = () => ({
    color: '#3B82F6',
    weight: 2,
    opacity: 0.8,
    fillColor: '#3B82F6',
    fillOpacity: 0.2,
});

const allDistrictsGeoJson = computed<FeatureCollection | null>(() => {
    if (!districts.value) return null;
    return {
        type: "FeatureCollection",
        features: districts.value
            .filter((d: { geom: any; }) => d.geom)
            .map((d: { name: any; geom: any; }) => ({
                type: "Feature",
                properties: { name: d.name },
                geometry: d.geom as any,
            })),
    };
});

function viewOnMap(district: District) {
    if (
        !district.geom ||
        !mapRef.value?.mapObject ||
        !district.geom.coordinates ||
        !Array.isArray(district.geom.coordinates) ||
        !district.geom.coordinates[0] ||
        !Array.isArray(district.geom.coordinates[0]) ||
        !district.geom.coordinates[0][0] ||
        !Array.isArray(district.geom.coordinates[0][0])
    ) return;
    const firstRing = district.geom.coordinates[0][0] as [number, number][];
    const centerLat = firstRing.reduce((sum, coord) => sum + coord[1], 0) / firstRing.length;
    const centerLng = firstRing.reduce((sum, coord) => sum + coord[0], 0) / firstRing.length;
    mapRef.value.mapObject.flyTo([centerLat, centerLng], 14);
}
</script>
