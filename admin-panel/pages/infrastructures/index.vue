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
    svgPath: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v4h4v2h-4v4h-2v-4H7v-2h4V7h2z",
    color: "#EF4444"
  },
  SCHOOL: {
    svgPath: "M12 3l9 6v12a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9l9-6zm0 2.5L6 9h12l-6-3.5z",
    color: "#3B82F6"
  },
  MARKET: {
    svgPath: "M3 8l2-4h14l2 4v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm3 0h12l-1-2H7l-1 2zm2 4v6h8v-6H8z",
    color: "#EAB308"
  },
  PARK: {
    svgPath: "M7 18h10a1 1 0 010 2H7a1 1 0 010-2zm5-15a4 4 0 014 4v2h1a2 2 0 110 4h-2v2a2 2 0 11-4 0v-2H9a2 2 0 110-4h1V7a4 4 0 014-4z",
    color: "#22C55E"
  },
  UTILITY: {
    svgPath: "M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7 7 0 00-.26-1.93l2.12-1.65-2-3.46-2.49.83a7 7 0 00-1.67-.97L16 2h-4l-.7 2.82a7 7 0 00-1.67.97l-2.49-.83-2 3.46 2.12 1.65A7 7 0 007 12a7 7 0 00.26 1.93L5.14 15.6l2 3.46 2.49-.83a7 7 0 001.67.97L10 22h4l.7-2.82a7 7 0 001.67-.97l2.49.83 2-3.46-2.12-1.65A7 7 0 0021 12z",
    color: "#8B5CF6"
  }
}

const defaultStyle = {
  svgPath: "M12 2a7 7 0 017 7c0 5-7 11-7 11S5 14 5 9a7 7 0 017-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  color: "#9CA3AF"
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
