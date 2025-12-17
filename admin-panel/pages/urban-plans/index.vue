<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Urban Plan Management</h1>
                <p class="mt-1 text-sm text-gray-400">Manage urban planning data across districts.</p>
            </div>
            <button
                @click="handleAdd"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add Urban Plan</span>
            </button>
        </header>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-grow">
                        <label class="block text-xs font-medium text-gray-400 mb-1">Search by Plan Name</label>
                        <UiSearchInput v-model="searchQuery" placeholder="Search by plan name..." />
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
                <div class="flex-grow flex flex-col min-h-0">
                    <div class="flex-grow overflow-y-auto">
                        <UiDataTable
                            :columns="columns"
                            :data="paginatedUrbanPlans"
                            :selected-id="selectedUrbanPlan?.id"
                            @row-click="handleRowClick"
                        >
                            <template #cell-zoningType="{ item }">
                                <FeaturesUrbanPlansZoningTypeBadge :type="item.zoningType" />
                            </template>
                            <template #cell-issuedDate="{ value }">
                                {{ new Date(value).toLocaleDateString('en-GB') }}
                            </template>
                            <template #actions="{ item }">
                                <div class="flex items-center justify-end gap-3">
                                    <button @click.stop="handleEdit(item.id)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click.stop="handleDelete(item.id, item.planName)" class="text-red-400 hover:text-red-300" title="Delete">
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

            <div class="xl:col-span-2 flex flex-col gap-8">
                <div class="relative h-[40vh] xl:h-auto xl:flex-grow">
                    <ClientOnly>
                        <UiLeafletMap ref="mapRef" :center="mapCenter" :zoom="11" class="h-full">
                            <LGeoJson
                                v-if="urbanPlanGeoJson"
                                :key="geoJsonKey"
                                :geojson="urbanPlanGeoJson"
                                :options-style="geoJsonStyleFunction"
                                @click="onPolygonClick"
                            />
                        </UiLeafletMap>
                        <FeaturesUrbanPlansMapLegend
                            :types="uniqueZoningTypes"
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
                    <UiDataDetailView title="Urban Plan Details" :item="selectedUrbanPlan" @close="selectedUrbanPlan = null">
                        <template #default="{ item }">
                            <ul class="space-y-3 text-sm">
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Plan Name</span>
                                    <span class="text-white font-medium text-right">{{ item.planName }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Zoning Type</span>
                                    <FeaturesUrbanPlansZoningTypeBadge :type="item.zoningType" />
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">District</span>
                                    <span class="text-white font-medium text-right">{{ item.districtName }}</span>
                                </li>
                                <li class="flex justify-between border-b border-gray-700 pb-3">
                                    <span class="font-semibold text-gray-400">Issued Date</span>
                                    <span class="text-white font-medium text-right">{{ new Date(item.issuedDate).toLocaleDateString('en-GB') }}</span>
                                </li>
                                <li class="pt-2">
                                    <span class="font-semibold text-gray-400">Description</span>
                                    <p class="text-white mt-1">{{ item.description || 'N/A' }}</p>
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
import { getLeafletStyle } from '~/utils/urbanPlanStyles'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'
import type { District } from '~/types/api/district'
import type { UrbanPlan } from '~/types/api/urban-plan'
import type { FeatureCollection } from 'geojson'

const { LGeoJson } = await import('@vue-leaflet/vue-leaflet')

useHead({ title: 'Urban Plan Management' })

const { $api } = useNuxtApp()
const router = useRouter()
const { confirmDelete, toastSuccess, toastError } = useSwal()

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || []

const searchQuery = ref('')
const selectedDistrictId = ref('')
const districtOptions = ref<{ label: string; value: string }[]>([])
const allUrbanPlans = ref<UrbanPlan[]>([])
const selectedUrbanPlan = ref<UrbanPlan | null>(null)
const highlightedType = ref<string | null>(null)
const mapRef = ref()
const mapCenter = ref<[number, number]>([10.7769, 106.7009])

const currentPage = ref(1)
const itemsPerPage = 5

useAsyncData('districts-for-filter', async () => {
    const response = await $api.districts.getAll()
    const districtData = extractData(response)
    if (Array.isArray(districtData)) {
        districtOptions.value = [
            { label: 'All Districts', value: '' },
            ...districtData.map((d: District) => ({ label: d.name, value: d.id }))
        ]
    }
    return districtData
})

const { refresh: refreshUrbanPlans } = useAsyncData(
    'urban-plans-list',
    async () => {
        const params = { districtId: selectedDistrictId.value || undefined }
        const response = await $api.urbanPlans.getAll(params)
        const plans = extractData(response) || []
        allUrbanPlans.value = plans.map((plan: any) => ({
            ...plan,
            geom: typeof plan.geom === 'string' ? JSON.parse(plan.geom) : plan.geom
        }))
        return allUrbanPlans.value
    },
    { watch: [selectedDistrictId] }
)

const columns: DataTableColumn[] = [
    { key: 'planName', label: 'Plan Name' },
    { key: 'zoningType', label: 'Zoning Type' },
    { key: 'districtName', label: 'District' },
    { key: 'issuedDate', label: 'Issued' }
]

const filteredUrbanPlans = computed(() => {
    if (!searchQuery.value) return allUrbanPlans.value
    const lowerCaseQuery = searchQuery.value.toLowerCase()
    return allUrbanPlans.value.filter(up =>
        up.planName.toLowerCase().includes(lowerCaseQuery)
    )
})

const totalPages = computed(() => {
    return Math.ceil(filteredUrbanPlans.value.length / itemsPerPage)
})

const paginatedUrbanPlans = computed(() => {
    if (!filteredUrbanPlans.value) return []
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredUrbanPlans.value.slice(start, end)
})

const urbanPlanGeoJson = computed<FeatureCollection | null>(() => {
    if (!filteredUrbanPlans.value || filteredUrbanPlans.value.length === 0) return null
    return {
        type: 'FeatureCollection',
        features: filteredUrbanPlans.value.filter(up => up.geom).map(up => ({
            type: 'Feature',
            properties: { ...up },
            geometry: up.geom as any
        }))
    }
})

const uniqueZoningTypes = computed(() => [...new Set(filteredUrbanPlans.value.map(up => up.zoningType))])
const geoJsonKey = computed(() => `${selectedDistrictId.value}-${searchQuery.value}-${highlightedType.value}`)

function geoJsonStyleFunction(feature: any) {
    return getLeafletStyle(feature?.properties.zoningType, highlightedType.value)
}

function handleRowClick(plan: UrbanPlan) {
    if (selectedUrbanPlan.value?.id === plan.id) {
        selectedUrbanPlan.value = null
        highlightedType.value = null
    } else {
        selectedUrbanPlan.value = plan
        highlightedType.value = plan.zoningType
        viewOnMap(plan)
    }
}

function onPolygonClick(event: any) {
    const properties = event.layer.feature.properties
    const plan = filteredUrbanPlans.value.find(up => up.id === properties.id)
    if (plan) handleRowClick(plan)
}

function viewOnMap(plan: UrbanPlan) {
    const mapInstance = mapRef.value?.mapObject
    if (!plan.geom || !mapInstance) return
    const geoJsonLayer = L.geoJSON(plan.geom as any)
    const bounds = geoJsonLayer.getBounds()
    if (bounds.isValid()) {
        mapInstance.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
}

function handleAdd() {
    router.push('/urban-plans/create')
}

function handleEdit(id: string) {
    router.push(`/urban-plans/${id}`)
}

async function handleDelete(id: string, name: string) {
    const result = await confirmDelete(`urban plan "${name}"`)
    if (result.isConfirmed) {
        try {
            await $api.urbanPlans.remove(id)
            toastSuccess(`Urban Plan has been deleted.`)
            selectedUrbanPlan.value = null
            await refreshUrbanPlans()
            if (paginatedUrbanPlans.value.length === 0 && currentPage.value > 1) {
                currentPage.value--
            }
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.')
        }
    }
}

watch([searchQuery, selectedDistrictId], () => {
    currentPage.value = 1
})

watch(filteredUrbanPlans, (newData) => {
    if (selectedUrbanPlan.value && !newData.some(p => p.id === selectedUrbanPlan.value?.id)) {
        selectedUrbanPlan.value = null
        highlightedType.value = null
    }
    const mapInstance = mapRef.value?.mapObject
    if (!mapInstance) return
    if (newData.length > 0 && urbanPlanGeoJson.value) {
        const geoJsonLayer = L.geoJSON(urbanPlanGeoJson.value as any)
        const bounds = geoJsonLayer.getBounds()
        if (bounds.isValid()) {
            mapInstance.flyToBounds(bounds, { padding: [20, 20] })
        }
    } else {
        mapInstance.flyTo(mapCenter.value, 11)
    }
}, { deep: true })
</script>

<style scoped>
.pagination-btn {
    @apply px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
</style>
