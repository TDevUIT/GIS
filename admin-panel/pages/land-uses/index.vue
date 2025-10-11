<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Land Use Management</h1>
                <p class="mt-1 text-sm text-gray-400">Visualize and manage land use data across districts.</p>
            </div>
            <button
                @click="handleAdd"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add Land Use</span>
            </button>
        </header>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-grow">
                        <label class="block text-xs font-medium text-gray-400 mb-1">Search</label>
                        <UiSearchInput v-model="searchQuery" placeholder="Search by type..." />
                    </div>
                </div>
                <div class="flex-grow overflow-y-auto">
                    <UiDataTable
                        :columns="columns"
                        :data="filteredLandUses"
                        :selected-id="selectedLandUse?.id"
                        @row-click="handleRowClick"
                    >
                        <template #cell-type="{ item }">
                            <FeaturesLandUsesLandUseTypeBadge :type="item.type" />
                        </template>
                        <template #cell-areaKm2="{ value }">
                            {{ value.toFixed(2) }} km²
                        </template>
                        <template #actions="{ item }">
                            <div class="flex items-center justify-end gap-3">
                                <button @click.stop="handleEdit(item.id)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                    <PencilSquareIcon class="h-5 w-5" />
                                </button>
                                <button @click.stop="handleDelete(item.id, item.type)" class="text-red-400 hover:text-red-300" title="Delete">
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
                                v-if="landUseGeoJson"
                                :key="geoJsonKey"
                                :geojson="landUseGeoJson"
                                :options-style="geoJsonStyleFunction"
                                @click="onPolygonClick"
                            />
                        </UiLeafletMap>
                        <FeaturesLandUsesMapLegend
                            :types="uniqueLandUseTypes"
                            :highlighted-type="highlightedType"
                            @highlight="highlightedType = $event"
                        />
                        <template #fallback>
                            <div class="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                                Loading Map...
                            </div>
                        </template>
                    </ClientOnly>
                </div>
                <div class="h-[40vh] xl:h-auto xl:flex-grow">
                    <UiDataDetailView title="Land Use Details" :item="selectedLandUse" @close="selectedLandUse = null">
                        <template #default="{ item }">
                            <ul class="space-y-3 text-sm">
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Type</span>
                                    <FeaturesLandUsesLandUseTypeBadge :type="item.type" />
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Area</span>
                                    <span class="text-white font-medium">{{ item.areaKm2.toFixed(2) }} km²</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Year</span>
                                    <span class="text-white font-medium">{{ item.year }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">District</span>
                                    <span class="text-white font-medium text-right">{{ item.districtName }}</span>
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
import { ref, computed, watch } from 'vue'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import L from 'leaflet'
import { getLeafletStyle } from '~/utils/landUseStyles'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'
import type { District } from '~/types/api/district'
import type { FeatureCollection } from 'geojson'

const { LGeoJson } = await import('@vue-leaflet/vue-leaflet')

interface LandUseListItem {
    id: string;
    type: string;
    areaKm2: number;
    year: number;
    districtId: string;
    districtName: string;
    geom: string;
}

useHead({ title: 'Land Use Management' })

const { $api } = useNuxtApp()
const router = useRouter()
const { confirmDelete, toastSuccess, toastError } = useSwal()

// Search and filter state
const searchQuery = ref('')
const selectedDistrictId = ref('')
const districtOptions = ref<{ label: string; value: string }[]>([])
const allLandUses = ref<LandUseListItem[]>([])
const selectedLandUse = ref<LandUseListItem | null>(null)
const highlightedType = ref<string | null>(null)
const mapRef = ref()
const mapCenter = ref<[number, number]>([10.7769, 106.7009])

// Load districts for filter dropdown
useAsyncData('districts-for-filter', async () => {
    const response = await $api.districts.getAll()
    const districtData = response.data.data
    if (Array.isArray(districtData)) {
        districtOptions.value = [
            { label: 'All Districts', value: '' },
            ...districtData.map((d: District) => ({ label: d.name, value: d.id }))
        ]
    }
    return districtData
})

// Load land uses with district filter
const { refresh: refreshLandUses } = useAsyncData(
    'land-uses-list',
    async () => {
        const params = {
            districtId: selectedDistrictId.value || undefined,
        }
        const response = await $api.landUses.getAll(params)
        allLandUses.value = response.data.data || []
        // Reset selected item if it's no longer in the filtered results
        if (
            selectedLandUse.value &&
            !allLandUses.value.some(lu => lu.id === selectedLandUse.value?.id)
        ) {
            selectedLandUse.value = null
        }
        return allLandUses.value
    },
    { watch: [selectedDistrictId] }
)

const columns: DataTableColumn[] = [
    { key: 'type', label: 'Type' },
    { key: 'districtName', label: 'District' },
    { key: 'year', label: 'Year' },
    { key: 'areaKm2', label: 'Area' },
]

// Combined search and filter logic
const filteredLandUses = computed(() => {
    if (!searchQuery.value) {
        return allLandUses.value
    }
    const lowerCaseQuery = searchQuery.value.toLowerCase()
    return allLandUses.value.filter(lu => 
        lu.type.toLowerCase().includes(lowerCaseQuery) ||
        lu.districtName.toLowerCase().includes(lowerCaseQuery)
    )
})

const landUseGeoJson = computed<FeatureCollection | null>(() => {
    if (!filteredLandUses.value || filteredLandUses.value.length === 0) return null
    return {
        type: 'FeatureCollection',
        features: filteredLandUses.value.filter(lu => lu.geom).map(lu => ({
            type: 'Feature',
            properties: { ...lu },
            geometry: JSON.parse(lu.geom) as any
        }))
    }
})

const uniqueLandUseTypes = computed(() => [...new Set(filteredLandUses.value.map(lu => lu.type))])
const geoJsonKey = computed(() => `${selectedDistrictId.value}-${searchQuery.value}-${highlightedType.value}`)

function geoJsonStyleFunction(feature: any) {
    return getLeafletStyle(feature?.properties.type, highlightedType.value)
}

function handleRowClick(landUse: LandUseListItem) {
    if (selectedLandUse.value?.id === landUse.id) {
        selectedLandUse.value = null
        highlightedType.value = null
    } else {
        selectedLandUse.value = landUse
        highlightedType.value = landUse.type
        viewOnMap(landUse)
    }
}

function onPolygonClick(event: any) {
    const properties = event.layer.feature.properties;
    const landUse = filteredLandUses.value.find(lu => lu.id === properties.id);
    if (landUse) {
        handleRowClick(landUse)
    }
}

function viewOnMap(landUse: LandUseListItem) {
    const mapInstance = mapRef.value?.mapObject
    if (!landUse.geom || !mapInstance) return

    const geoJsonLayer = L.geoJSON(JSON.parse(landUse.geom) as any)
    const bounds = geoJsonLayer.getBounds()
    if (bounds.isValid()) {
        mapInstance.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
}

function handleAdd() {
    router.push('/land-uses/create');
}

function handleEdit(id: string) {
    router.push(`/land-uses/${id}`);
}

async function handleDelete(id: string, type: string) {
    const result = await confirmDelete(`land use of type "${type}"`);
    if (result.isConfirmed) {
        try {
            await $api.landUses.remove(id);
            toastSuccess(`Land Use has been deleted.`);
            selectedLandUse.value = null
            await refreshLandUses();
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.');
        }
    }
}

// Auto-fit map bounds when filtered data changes
watch(filteredLandUses, (newData) => {
    if (newData.length > 0 && landUseGeoJson.value) {
        const mapInstance = mapRef.value?.mapObject
        if (!mapInstance) return
        const geoJsonLayer = L.geoJSON(landUseGeoJson.value as any)
        const bounds = geoJsonLayer.getBounds()
        if (bounds.isValid()) {
            mapInstance.flyToBounds(bounds, { padding: [20, 20] })
        }
    }
}, { deep: true });
</script>
