<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Wards Management</h1>
                <p class="mt-1 text-sm text-gray-400">Manage wards within each district.</p>
            </div>
            <button
                @click="handleAdd"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add Ward</span>
            </button>
        </header>
        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-grow">
                        <label for="district-filter" class="block text-xs font-medium text-gray-400 mb-1">Filter by District</label>
                        <UiAppDropdown
                            v-if="districtOptions.length > 0"
                            v-model="selectedDistrictId"
                            :options="districtOptions"
                            placeholder="All Districts"
                            class="w-full"
                        />
                    </div>
                    <div class="flex-grow">
                        <label for="search" class="block text-xs font-medium text-gray-400 mb-1">Search</label>
                        <UiSearchInput v-model="searchQuery" placeholder="Search by ward name..." />
                    </div>
                </div>
                <div class="flex-grow overflow-y-auto">
                    <UiDataTable
                        :columns="columns"
                        :data="filteredWards"
                        :selected-id="selectedWard?.id"
                        @row-click="handleRowClick"
                    >
                        <template #cell-updatedAt="{ value }">
                            {{ new Date(value).toLocaleDateString('en-GB') }}
                        </template>
                        <template #actions="{ item }">
                            <div class="flex items-center justify-end gap-3">
                                <button
                                    @click.stop="viewOnMap(item)"
                                    class="text-gray-400 hover:text-white transition-colors"
                                    title="View on Map"
                                >
                                    <MapPinIcon class="h-5 w-5" />
                                </button>
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
            </div>
            <div class="xl:col-span-2 flex flex-col gap-8">
                <div class="h-[40vh] xl:h-auto xl:flex-grow">
                    <ClientOnly>
                        <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="11" class="h-full">
                            <LGeoJson
                                v-if="wardsGeoJson"
                                :key="geoJsonKey"
                                :geojson="wardsGeoJson"
                                :options-style="geoJsonStyle"
                            />
                        </UiLeafletMap>
                        <template #fallback>
                            <div class="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                                Loading Map...
                            </div>
                        </template>
                    </ClientOnly>
                </div>
                <div class="h-[40vh] xl:h-auto xl:flex-grow">
                    <UiDataDetailView title="Ward Details" :item="selectedWard" @close="selectedWard = null">
                        <template #default="{ item }">
                            <ul class="space-y-3 text-sm">
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Name</span>
                                    <span class="text-white font-medium text-right">{{ item.name }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Code</span>
                                    <span class="text-white text-right">{{ item.code }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">District</span>
                                    <span class="text-white text-right">{{ item.districtName }}</span>
                                </li>
                                <li class="flex justify-between pb-3">
                                    <span class="font-semibold text-gray-400">Last Updated</span>
                                    <span class="text-white text-right">{{ new Date(item.updatedAt).toLocaleString('en-GB') }}</span>
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
import { PlusIcon, PencilSquareIcon, TrashIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { useSwal } from '~/composables/useSwal'
import L from 'leaflet'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'
import type { Ward } from '~/types/api/ward'
import type { District } from '~/types/api/district'
import type { FeatureCollection } from 'geojson'

const LGeoJson = (await import('@vue-leaflet/vue-leaflet')).LGeoJson

useHead({ title: 'Wards Management' })

const { $api } = useNuxtApp()
const router = useRouter()
const { confirmDelete, toastSuccess, toastError } = useSwal()

const searchQuery = ref('')
const selectedDistrictId = ref('')
const districtOptions = ref<{ label: string; value: string }[]>([])
const allWards = ref<Ward[]>([])
const selectedWard = ref<Ward | null>(null)
const mapRef = ref()
const mapCenter = ref<[number, number]>([10.7769, 106.7009])

useAsyncData('districts-for-filter', async () => {
    const response = await $api.districts.getAll()
    const districtData = response.data.data
    if (Array.isArray(districtData) && districtData.length > 0) {
        districtOptions.value = [
            { label: 'All Districts', value: '' },
            ...districtData.map((d: District) => ({ label: d.name, value: d.id }))
        ]
    }
    return districtData
})

const { refresh: refreshWards } = useAsyncData(
    'wards-list',
    async () => {
        const response = await $api.wards.getAll({ districtId: selectedDistrictId.value || undefined })
        allWards.value = response.data.data || []
        if (selectedWard.value && !allWards.value.some(w => w.id === selectedWard.value?.id)) {
            selectedWard.value = null
        }
        return allWards.value
    },
    { watch: [selectedDistrictId] }
)

const columns: DataTableColumn[] = [
    { key: 'name', label: 'Ward' },
    { key: 'districtName', label: 'District' },
    { key: 'code', label: 'Code' },
    { key: 'updatedAt', label: 'Last Updated' }
]

const filteredWards = computed(() => {
    let data = allWards.value
    if (!searchQuery.value) return data
    const lowerCaseQuery = searchQuery.value.toLowerCase()
    return data.filter((w: Ward) => w.name.toLowerCase().includes(lowerCaseQuery))
})

function handleAdd() {
    router.push('/wards/create')
}
function handleEdit(id: string) {
    router.push(`/wards/${id}`)
}
async function handleDelete(id: string, name: string) {
    const result = await confirmDelete(name)
    if (result.isConfirmed) {
        try {
            await $api.wards.remove(id)
            toastSuccess(`Ward "${name}" has been deleted.`)
            selectedWard.value = null
            await refreshWards()
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.')
        }
    }
}

function handleRowClick(ward: Ward) {
    if (selectedWard.value?.id === ward.id) {
        selectedWard.value = null
    } else {
        selectedWard.value = ward
        viewOnMap(ward)
    }
}

const geoJsonStyle = () => ({
    color: '#8B5CF6',
    weight: 2,
    opacity: 0.9,
    fillColor: '#8B5CF6',
    fillOpacity: 0.2
})

const wardsGeoJson = computed<FeatureCollection | null>(() => {
    if (!filteredWards.value || filteredWards.value.length === 0) return null
    return {
        type: 'FeatureCollection',
        features: filteredWards.value.filter(w => w.geom).map(w => ({
            type: 'Feature',
            properties: { name: w.name },
            geometry: w.geom as any
        }))
    }
})

const geoJsonKey = computed(() => `${selectedDistrictId.value}-${searchQuery.value}`)

function viewOnMap(ward: Ward) {
    const mapInstance = mapRef.value?.mapObject
    if (!ward.geom || !mapInstance) return
    const geoJsonLayer = L.geoJSON(ward.geom as any)
    const bounds = geoJsonLayer.getBounds()
    if (bounds.isValid()) {
        mapInstance.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
}

watch(
    filteredWards,
    newWards => {
        const mapInstance = mapRef.value?.mapObject
        if (!mapInstance) return
        if (newWards && newWards.length > 0) {
            const geoJsonLayer = L.geoJSON(wardsGeoJson.value as any)
            const bounds = geoJsonLayer.getBounds()
            if (bounds.isValid()) {
                mapInstance.flyToBounds(bounds, { padding: [20, 20] })
            }
        } else {
            mapInstance.flyTo(mapCenter.value, 11)
        }
    },
    { deep: true }
)
</script>
