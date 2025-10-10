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
                <div class="flex-grow overflow-y-auto">
                    <UiDataTable
                        :columns="columns"
                        :data="searchedInfrastructures"
                        :selected-id="selectedInfrastructure?.id"
                        @row-click="handleRowClick"
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
            </div>
            <div class="xl:col-span-2 flex flex-col gap-8">
                <div class="h-[40vh] xl:h-auto xl:flex-grow">
                    <ClientOnly>
                        <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="11" class="h-full">
                            <LMarker
                                v-for="infra in searchedInfrastructures"
                                :key="infra.id"
                                :lat-lng="parseCoordinates(infra.geom)"
                                :icon="createIconForCategory(infra.category) as any"
                            >
                                <LPopup>{{ infra.name }}</LPopup>
                            </LMarker>
                        </UiLeafletMap>
                        <template #fallback>
                            <div class="h-full w-full bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                                Loading Map...
                            </div>
                        </template>
                    </ClientOnly>
                </div>
                <div class="h-[40vh] xl:h-auto xl:flex-grow">
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
import { ref, computed, watch } from 'vue' // === SỬA Ở ĐÂY: Thêm lại `watch` ===
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline' // === SỬA Ở ĐÂY: Thêm lại import này ===
import type { DataTableColumn } from '~/components/ui/DataTable.vue'
import type { District } from '~/types/api/district'
import L from 'leaflet'

const { LMarker, LPopup } = await import('@vue-leaflet/vue-leaflet')

interface InfrastructureListItem {
    id: string;
    name: string;
    address: string;
    category: 'HOSPITAL' | 'SCHOOL' | 'MARKET' | 'PARK' | 'UTILITY';
    districtId: string;
    districtName: string;
    geom: string;
    updatedAt: string;
    details: any;
}

useHead({ title: 'Infrastructures Management' })

const { $api } = useNuxtApp()
const router = useRouter()
const { confirmDelete, toastSuccess, toastError } = useSwal()

const searchQuery = ref('')
const selectedDistrictId = ref('')
const districtOptions = ref<{ label: string; value: string }[]>([])
const allInfrastructures = ref<InfrastructureListItem[]>([])
const selectedInfrastructure = ref<InfrastructureListItem | null>(null)
const mapRef = ref()
const mapCenter = ref<[number, number]>([10.7769, 106.7009])

const categoryStyles = {
    HOSPITAL: {
        svgPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21m-8.25-18h-1.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25h-1.5',
        color: '#EF4444'
    },
    SCHOOL: {
        svgPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21m-8.25-18h-1.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25h-1.5',
        color: '#3B82F6'
    },
    MARKET: {
        svgPath: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25L5.106 5.165A1.125 1.125 0 016.21 3.869h11.58a1.125 1.125 0 011.104 1.296L18.75 14.25M7.5 14.25a3 3 0 013 3M15.75 17.25a3 3 0 013 3M14.25 14.25h-4.5',
        color: '#EAB308'
    },
    PARK: {
        svgPath: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364L6.98 7.03M12 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z',
        color: '#22C55E'
    },
    UTILITY: {
        svgPath: 'M21.75 9.75l-1.46-1.46a1.125 1.125 0 00-1.59 0l-1.46 1.46a1.125 1.125 0 000 1.59l1.46 1.46a1.125 1.125 0 001.59 0l1.46-1.46a1.125 1.125 0 000-1.59zM12.375 18.75l-1.46-1.46a1.125 1.125 0 00-1.59 0l-1.46 1.46a1.125 1.125 0 000 1.59l1.46 1.46a1.125 1.125 0 001.59 0l1.46-1.46a1.125 1.125 0 000-1.59zM9.75 14.25l-1.46-1.46a1.125 1.125 0 00-1.59 0l-1.46 1.46a1.125 1.125 0 000 1.59l1.46 1.46a1.125 1.125 0 001.59 0l1.46-1.46a1.125 1.125 0 000-1.59zM18 6l-1.46-1.46a1.125 1.125 0 00-1.59 0L12 7.46 9.04 4.5a1.125 1.125 0 00-1.59 0L6 6.04 3.04 3.09a1.125 1.125 0 00-1.59 0L.09 4.54a1.125 1.125 0 000 1.59L3 9l-2.95 2.95a1.125 1.125 0 000 1.59L1.5 15l2.95-2.95a1.125 1.125 0 001.59 0L9 9.04l2.95 2.95a1.125 1.125 0 001.59 0L15 10.5l2.95 2.95a1.125 1.125 0 001.59 0L20.9 12a1.125 1.125 0 000-1.59L18 7.46 20.9 4.5a1.125 1.125 0 000-1.59L19.46 1.5a1.125 1.125 0 00-1.59 0L15 4.46 12.04 1.5a1.125 1.125 0 00-1.59 0L9 3.04 6.04.09a1.125 1.125 0 00-1.59 0L3.09 1.54a1.125 1.125 0 000 1.59L6 6l-2.95 2.95a1.125 1.125 0 000 1.59L4.5 12l2.95-2.95a1.125 1.125 0 001.59 0L12 6.04l2.95 2.95a1.125 1.125 0 001.59 0L18 7.5l2.95-2.95a1.125 1.125 0 000-1.59z',
        color: '#8B5CF6'
    }
}
const defaultStyle = {
    svgPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    color: '#9CA3AF'
}

const iconCache = new Map<string, L.DivIcon>()
function createIconForCategory(category: InfrastructureListItem['category']) {
    const cacheKey = category || 'default'
    if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey)!
    }
    const style = categoryStyles[category] || defaultStyle
    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${style.color}" class="w-8 h-8">
        <path fill-rule="evenodd" d="${style.svgPath}" clip-rule="evenodd" />
      </svg>
    `
    const newIcon = L.divIcon({
        html: iconHtml,
        className: 'transparent-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    })
    iconCache.set(cacheKey, newIcon)
    return newIcon
}

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

const { refresh: refreshInfrastructures } = useAsyncData(
    'infrastructures-list',
    async () => {
        const response = await $api.infrastructures.getAll({ districtId: selectedDistrictId.value || undefined })
        allInfrastructures.value = response.data.data || []
        if (
            selectedInfrastructure.value &&
            !allInfrastructures.value.some(i => i.id === selectedInfrastructure.value?.id)
        ) {
            selectedInfrastructure.value = null
        }
        return allInfrastructures.value
    },
    { watch: [selectedDistrictId] }
)

const columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'address', label: 'Address' },
    { key: 'districtName', label: 'District' }
]

const searchedInfrastructures = computed(() => {
    if (!searchQuery.value) {
        return allInfrastructures.value
    }
    const lowerCaseQuery = searchQuery.value.toLowerCase()
    return allInfrastructures.value.filter(i => i.name.toLowerCase().includes(lowerCaseQuery))
})

function handleAdd() {
    router.push('/infrastructures/create')
}
function handleEdit(id: string) {
    router.push(`/infrastructures/${id}`)
}
async function handleDelete(id: string, name: string) {
    const result = await confirmDelete(name)
    if (result.isConfirmed) {
        try {
            await $api.infrastructures.remove(id)
            toastSuccess(`"${name}" has been deleted.`)
            selectedInfrastructure.value = null
            await refreshInfrastructures()
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.')
        }
    }
}

function handleRowClick(infra: InfrastructureListItem) {
    if (selectedInfrastructure.value?.id === infra.id) {
        selectedInfrastructure.value = null
    } else {
        selectedInfrastructure.value = infra
        viewOnMap(infra)
    }
}

function parseCoordinates(geomString: string): [number, number] {
    try {
        const geom = JSON.parse(geomString)
        if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
            return [geom.coordinates[1], geom.coordinates[0]]
        }
    } catch (e) {
        return mapCenter.value
    }
    return mapCenter.value
}

function viewOnMap(infra: InfrastructureListItem) {
    const mapInstance = mapRef.value?.mapObject
    if (!infra.geom || !mapInstance) return
    const coordinates = parseCoordinates(infra.geom)
    mapInstance.flyTo(coordinates, 16)
}

// === SỬA Ở ĐÂY: Thêm lại `watch` để cập nhật bản đồ ===
watch(searchedInfrastructures, (newInfras) => {
    const mapInstance = mapRef.value?.mapObject;
    if (!mapInstance || newInfras.length === 0) return;

    // Tạo một FeatureGroup từ tất cả các marker để lấy bounds
    const markers = newInfras
        .map(infra => {
            try {
                const coords = parseCoordinates(infra.geom);
                // Kiểm tra tọa độ hợp lệ
                if (coords[0] !== mapCenter.value[0] || coords[1] !== mapCenter.value[1]) {
                    return L.marker(coords);
                }
                return null;
            } catch {
                return null;
            }
        })
        .filter(Boolean) as L.Marker[];

    if (markers.length > 0) {
        const featureGroup = L.featureGroup(markers);
        mapInstance.flyToBounds(featureGroup.getBounds(), { padding: [50, 50], maxZoom: 16 });
    }
}, { deep: true });
</script>
