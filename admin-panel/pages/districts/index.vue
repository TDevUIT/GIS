<template>
    <div class="space-y-8"> 
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-2xl font-bold text-white">Districts Management</h1>
                <p class="mt-1 text-sm text-gray-400">View, search, and manage all districts in the system.</p>
            </div>
            <div class="flex items-center gap-4 w-full md:w-auto">
                <UiSearchInput v-model="searchQuery" placeholder="Search by name or code..." class="w-full md:w-64" />
                <button
                    @click="handleAdd"
                    class="flex-shrink-0 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                    <PlusIcon class="h-5 w-5" />
                    <span>Add District</span>
                </button>
            </div>
        </header>
        <div class="space-y-8">
            <div>
                <div v-if="pending" class="flex items-center justify-center h-64 text-gray-400">Loading...</div>
                <div v-else-if="error" class="text-red-400">Failed to load districts: {{ error.message }}</div>
                <UiDataTable
                    v-else
                    :columns="columns"
                    :data="filteredDistricts"
                    :selected-id="selectedDistrict?.id"
                    @row-click="handleRowClick"
                >
                    <template #cell-areaKm2="{ value }">
                        {{ value ? `${value.toFixed(2)} km²` : 'N/A' }}
                    </template>
                    <template #cell-updatedAt="{ value }">
                        {{ new Date(value).toLocaleDateString('en-GB') }}
                    </template>
                    <template #actions="{ item }">
                        <div class="flex items-center justify-end gap-3">
                            <button
                                @click.stop="handleEdit(item.id)"
                                class="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Edit"
                            >
                                <PencilSquareIcon class="h-5 w-5" />
                            </button>
                            <button
                                @click.stop="handleDelete(item.id, item.name)"
                                class="text-red-400 hover:text-red-300 transition-colors"
                                title="Delete"
                            >
                                <TrashIcon class="h-5 w-5" />
                            </button>
                        </div>
                    </template>
                </UiDataTable>
            </div>
            <div>
                <h2 class="text-xl font-semibold text-white mb-4">Districts Map</h2>
                <ClientOnly>
                    <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="11" class="h-[50vh]">
                        <LGeoJson
                            v-if="districtsGeoJson"
                            :key="geoJsonKey"
                            :geojson="districtsGeoJson"
                            :options-style="geoJsonStyleFunction"
                            @click="onPolygonClick"
                        />
                    </UiLeafletMap>
                    <template #fallback>
                        <div class="h-[50vh] w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                            Loading Map...
                        </div>
                    </template>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';
import type { District } from '~/types/api/district';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';

const { LGeoJson } = await import('@vue-leaflet/vue-leaflet');

useHead({ title: 'Districts Management' });

const { $api } = useNuxtApp();
const router = useRouter();
const { confirmDelete, toastSuccess, toastError } = useSwal();

const allDistricts = ref<District[]>([]);
const selectedDistrict = ref<District | null>(null);
const searchQuery = ref('');
const mapRef = ref();
const mapCenter = ref<[number, number]>([10.7769, 106.7009]);

const { pending, error, refresh: refreshDistricts } = useAsyncData('districts-list', async () => {
    const response = await $api.districts.getAll();
    const data = response.data.data || [];
    allDistricts.value = data.map((d: any) => ({
        ...d,
        geom: typeof d.geom === 'string' ? JSON.parse(d.geom) : d.geom,
    }));
    return allDistricts.value;
});

const columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'areaKm2', label: 'Area' },
    { key: 'updatedAt', label: 'Last Updated' },
];

const filteredDistricts = computed(() => {
    if (!searchQuery.value) return allDistricts.value;
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return allDistricts.value.filter((d) => 
        d.name.toLowerCase().includes(lowerCaseQuery) || 
        d.code.toLowerCase().includes(lowerCaseQuery)
    );
});

const districtsGeoJson = computed<FeatureCollection | null>(() => {
    if (!filteredDistricts.value) return null;
    return {
        type: "FeatureCollection",
        features: filteredDistricts.value
            .filter(d => d.geom)
            .map(d => ({
                type: "Feature",
                properties: { ...d },
                geometry: d.geom as any,
            })),
    };
});

const geoJsonKey = computed(() => `${searchQuery.value}-${selectedDistrict.value?.id}`);

function geoJsonStyleFunction(feature: any) {
    const isSelected = selectedDistrict.value?.id === feature?.properties.id;
    return {
        color: isSelected ? '#FBBF24' : '#3B82F6',
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillColor: isSelected ? '#FBBF24' : '#3B82F6',
        fillOpacity: isSelected ? 0.5 : 0.2,
    };
}

function handleRowClick(district: District) {
    if (selectedDistrict.value?.id === district.id) {
        selectedDistrict.value = null;
    } else {
        selectedDistrict.value = district;
        viewOnMap(district);
    }
}

function onPolygonClick(event: any) {
    const properties = event.layer.feature.properties;
    const district = filteredDistricts.value.find(d => d.id === properties.id);
    if (district) {
        handleRowClick(district);
    }
}

function viewOnMap(district: District) {
    const mapInstance = mapRef.value?.mapObject;
    if (!district.geom || !mapInstance) return;
    const geoJsonLayer = L.geoJSON(district.geom as any);
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
        mapInstance.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
}

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
            if (selectedDistrict.value?.id === id) {
                selectedDistrict.value = null;
            }
            await refreshDistricts();
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}

watch(filteredDistricts, (newDistricts) => {
    if (selectedDistrict.value && !newDistricts.some(d => d.id === selectedDistrict.value?.id)) {
        selectedDistrict.value = null;
    }
    const mapInstance = mapRef.value?.mapObject;
    if (!mapInstance) return;
    if (newDistricts.length > 0 && districtsGeoJson.value) {
        const geoJsonLayer = L.geoJSON(districtsGeoJson.value as any);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
            mapInstance.flyToBounds(bounds, { padding: [20, 20] });
        }
    } else {
        mapInstance.flyTo(mapCenter.value, 11);
    }
}, { deep: true });
</script>
