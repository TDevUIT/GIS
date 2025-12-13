<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">Traffic & Accident Dashboard</h1>
                <p class="mt-1 text-sm text-gray-400">Monitor traffic routes and analyze accident data.</p>
            </div>
            <button @click="handleAddTraffic" class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                <PlusIcon class="h-5 w-5" />
                <span>Add Traffic Route</span>
            </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="lg:col-span-1 h-80">
                <FeaturesTrafficsTrafficRiskTable :data="analyticsData.riskAssessment" />
            </div>
            <div class="lg:col-span-1 h-80">
                <FeaturesTrafficsAccidentTimeChart
                    title="Accidents by Time of Day"
                    :chart-labels="analyticsData.byTimeOfDay?.labels || []"
                    :chart-values="analyticsData.byTimeOfDay?.values || []"
                />
            </div>
            <div class="lg:col-span-1 h-80">
                <FeaturesTrafficsAccidentTimeChart
                    title="Accidents by Day of Week"
                    :chart-labels="analyticsData.byDayOfWeek?.labels || []"
                    :chart-values="analyticsData.byDayOfWeek?.values || []"
                />
            </div>
        </div>

        <div class="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-0">
            <div class="xl:col-span-1 flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                    <UiSearchInput v-model="searchQuery" placeholder="Search by road name..." class="flex-grow" />
                </div>

                <div class="flex-grow flex flex-col min-h-0">
                    <div class="flex-grow overflow-y-auto">
                        <UiDataTable
                            :columns="columns"
                            :data="paginatedTraffics"
                            :selected-id="selectedTraffic?.id"
                            @row-click="handleRowClick"
                        >
                            <template #cell-trafficVolume="{ value }">
                                {{ value?.toLocaleString() ?? 'N/A' }}
                            </template>

                            <template #cell-accidentCount="{ item }">
                                <span class="font-semibold" :class="item.accidents.length > 5 ? 'text-red-400' : item.accidents.length > 0 ? 'text-amber-400' : 'text-gray-400'">
                                    {{ item.accidents.length }}
                                </span>
                            </template>

                            <template #actions="{ item }">
                                <div class="flex items-center justify-end gap-3">
                                    <button @click.stop="handleEditTraffic(item.id)" class="text-blue-400 hover:text-blue-300" title="Edit">
                                        <PencilSquareIcon class="h-5 w-5" />
                                    </button>
                                    <button @click.stop="handleDeleteTraffic(item.id, item.roadName)" class="text-red-400 hover:text-red-300" title="Delete">
                                        <TrashIcon class="h-5 w-5" />
                                    </button>
                                </div>
                            </template>
                        </UiDataTable>
                    </div>

                    <div v-if="totalPages > 1" class="flex-shrink-0 flex items-center justify-between mt-4">
                        <span class="text-sm text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>
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
                                v-if="trafficGeoJson"
                                :key="geoJsonKey"
                                :geojson="trafficGeoJson"
                                :options-style="geoJsonStyleFunction"
                                @click="onLineClick"
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
                    <UiDataDetailView title="Traffic Route Details" :item="selectedTrafficWithAccidents" @close="selectedTraffic = null">
                        <template #default="{ item }">
                            <ul class="space-y-3 text-sm mb-6">
                                <li class="flex justify-between border-b border-gray-700 pb-2">
                                    <span class="font-semibold text-gray-400">Road Name</span>
                                    <span class="text-white font-medium text-right">{{ item.roadName }}</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-semibold text-gray-400">District</span>
                                    <span class="text-white font-medium text-right">{{ item.districtName }}</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-semibold text-gray-400">Live Traffic Volume</span>
                                    <span class="text-white font-medium text-right">{{ item.trafficVolume?.toLocaleString() ?? 'N/A' }} vehicles/hr</span>
                                </li>
                                <li class="flex justify-between">
                                    <span class="font-semibold text-gray-400">Total Accidents</span>
                                    <span class="text-white font-bold text-xl">{{ item.accidents.length }}</span>
                                </li>
                            </ul>

                            <div class="flex justify-between items-center mb-2">
                                <h4 class="text-base font-semibold text-white">Recent Accidents on this Route</h4>
                                <button @click="openAccidentModal(null)" class="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                                    <PlusIcon class="h-4 w-4" />
                                    Add Accident
                                </button>
                            </div>

                            <div class="max-h-60 overflow-y-auto pr-2">
                                <ul v-if="item.accidents.length > 0" class="divide-y divide-gray-700">
                                    <FeaturesTrafficsAccidentListItem
                                        v-for="accident in item.accidents"
                                        :key="accident.id"
                                        :accident="accident"
                                        @edit="openAccidentModal"
                                        @delete="handleDeleteAccident"
                                    />
                                </ul>
                                <p v-else class="text-sm text-gray-500 text-center py-4">No accidents recorded on this route.</p>
                            </div>
                        </template>
                    </UiDataDetailView>
                </div>
            </div>
        </div>

        <FeaturesTrafficsAccidentFormModal
            :is-open="isAccidentModalOpen"
            :traffic-id="selectedTraffic?.id || null"
            :traffic-name="selectedTraffic?.roadName || null"
            :initial-data="editingAccident"
            @close="isAccidentModalOpen = false"
            @saved="handleAccidentSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import L from 'leaflet'
import { getTrafficLineStyle } from '~/utils/trafficStyles'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'
import type { Traffic } from '~/types/api/traffic'
import type { Accident } from '~/types/api/accident'
import type { TrafficRisk } from '~/types/api/analytics'
import type { FeatureCollection } from 'geojson'
import { useRealtime } from '~/composables/useRealtime'

const { LGeoJson } = await import('@vue-leaflet/vue-leaflet')
useHead({ title: 'Traffic Dashboard' })

const { $api } = useNuxtApp()
const router = useRouter()
const { confirmDelete, toastSuccess, toastError } = useSwal()
const { subscribe, unsubscribe } = useRealtime()

const searchQuery = ref('')
const selectedDistrictId = ref('')
const allTraffics = ref<(Traffic & { accidents: Accident[] })[]>([])
const selectedTraffic = ref<Traffic | null>(null)
const selectedTrafficWithAccidents = ref<(Traffic & { accidents: Accident[] }) | null>(null)
const mapRef = ref()
const mapCenter = ref<[number, number]>([10.7769, 106.7009])
const isAccidentModalOpen = ref(false)
const editingAccident = ref<Accident | null>(null)

const currentPage = ref(1)
const itemsPerPage = 5

const analyticsData = reactive({
    riskAssessment: null as TrafficRisk[] | null,
    byTimeOfDay: null as { labels: string[]; values: number[] } | null,
    byDayOfWeek: null as { labels: string[]; values: number[] } | null,
})

const { refresh: refreshAllData } = useAsyncData(
    'traffics-and-analytics',
    async () => {
        const [trafficRes, accidentRes, riskRes, timeOfDayRes, dayOfWeekRes] = await Promise.all([
            $api.traffics.getAll({ districtId: selectedDistrictId.value || undefined }),
            $api.accidents.getAll(),
            $api.analytics.getTrafficRiskAssessment(),
            $api.analytics.getAccidentsByTimeOfDay(),
            $api.analytics.getAccidentsByDayOfWeek(),
        ])

        const traffics = (trafficRes.data.data || []).map((t: any) => ({
            ...t,
            geom: typeof t.geom === 'string' ? JSON.parse(t.geom) : t.geom,
        }))

        const accidents = accidentRes.data.data || []
        const accidentsByTrafficId = accidents.reduce((acc: any, current: Accident) => {
            (acc[current.trafficId] = acc[current.trafficId] || []).push(current)
            return acc
        }, {} as Record<string, Accident[]>)

        allTraffics.value = traffics.map((t: any) => ({
            ...t,
            accidents: (accidentsByTrafficId[t.id] || []).sort((a: Accident, b: Accident) => new Date(b.accidentDate).getTime() - new Date(a.accidentDate).getTime()),
        }))

        analyticsData.riskAssessment = riskRes.data.data || []
        const timeData = timeOfDayRes.data.data || []
        analyticsData.byTimeOfDay = {
            labels: timeData.map((d: any) => d.timeOfDay.replace(/\s/g, '')),
            values: timeData.map((d: any) => d.accidentCount),
        }
        const dayData = dayOfWeekRes.data.data || []
        analyticsData.byDayOfWeek = {
            labels: dayData.map((d: any) => d.dayOfWeek.trim()),
            values: dayData.map((d: any) => d.accidentCount),
        }

        return { traffics: allTraffics.value, analytics: analyticsData }
    },
    { watch: [selectedDistrictId] }
)

const columns: DataTableColumn[] = [
    { key: 'roadName', label: 'Road Name' },
    { key: 'trafficVolume', label: 'Volume' },
    { key: 'accidentCount', label: 'Accidents' },
]

const filteredTraffics = computed(() => {
    if (!searchQuery.value) return allTraffics.value
    const lowerCaseQuery = searchQuery.value.toLowerCase()
    return allTraffics.value.filter((t: any) => t.roadName.toLowerCase().includes(lowerCaseQuery))
})

const totalPages = computed(() => Math.ceil(filteredTraffics.value.length / itemsPerPage))

const paginatedTraffics = computed(() => {
    if (!filteredTraffics.value) return []
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTraffics.value.slice(start, end)
})

const trafficGeoJson = computed<FeatureCollection | null>(() => {
    if (!filteredTraffics.value.length) return null
    return {
        type: 'FeatureCollection',
        features: filteredTraffics.value
            .filter((t: any) => t.geom)
            .map((t: any) => ({
                type: 'Feature',
                properties: { id: t.id, name: t.roadName, accidentCount: t.accidents.length },
                geometry: t.geom as any,
            })),
    }
})

const geoJsonKey = computed(() => `${selectedDistrictId.value}-${searchQuery.value}-${selectedTraffic.value?.id}`)

function geoJsonStyleFunction(feature: any) {
    const isSelected = selectedTraffic.value?.id === feature?.properties.id
    return getTrafficLineStyle(feature?.properties.accidentCount, isSelected)
}

function handleRowClick(traffic: Traffic) {
    if (selectedTraffic.value?.id === traffic.id) {
        selectedTraffic.value = null
    } else {
        selectedTraffic.value = traffic
        viewOnMap(traffic)
    }
}

function onLineClick(event: any) {
    const properties = event.layer.feature.properties
    const traffic = filteredTraffics.value.find((t: any) => t.id === properties.id)
    if (traffic) handleRowClick(traffic)
}

function viewOnMap(traffic: Traffic) {
    const map = mapRef.value?.mapObject
    if (!traffic.geom || !map) return
    const geoJsonLayer = L.geoJSON(traffic.geom as any)
    const bounds = geoJsonLayer.getBounds()
    if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16 })
    }
}

function handleAddTraffic() {
    router.push('/traffics/create')
}

function handleEditTraffic(id: string) {
    router.push(`/traffics/${id}`)
}

async function handleDeleteTraffic(id: string, name: string) {
    const result = await confirmDelete(`traffic route "${name}"`)
    if (result.isConfirmed) {
        try {
            await $api.traffics.remove(id)
            toastSuccess('Traffic route has been deleted.')
            if (selectedTraffic.value?.id === id) {
                selectedTraffic.value = null
            }
            await refreshAllData()
            if (paginatedTraffics.value.length === 0 && currentPage.value > 1) {
                currentPage.value--
            }
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.')
        }
    }
}

function openAccidentModal(accident: Accident | null) {
    editingAccident.value = accident
    isAccidentModalOpen.value = true
}

async function handleAccidentSaved() {
    toastSuccess('Accident record saved successfully!')
    await refreshAllData()
}

async function handleDeleteAccident(accidentId: string) {
    const result = await confirmDelete('this accident record')
    if (result.isConfirmed) {
        try {
            await $api.accidents.remove(accidentId)
            toastSuccess('Accident record has been deleted.')
            await refreshAllData()
        } catch (err: any) {
            toastError('Deletion failed', err.data?.message || 'An error occurred.')
        }
    }
}

watch(
    selectedTraffic,
    (newSelection) => {
        if (newSelection) {
            selectedTrafficWithAccidents.value = allTraffics.value.find((t: any) => t.id === newSelection.id) || null
        } else {
            selectedTrafficWithAccidents.value = null
        }
    },
    { deep: true }
)

watch([searchQuery, selectedDistrictId], () => {
    currentPage.value = 1
})

watch(filteredTraffics, () => {
    if (selectedTraffic.value && !filteredTraffics.value.some((t: any) => t.id === selectedTraffic.value?.id)) {
        selectedTraffic.value = null
    }
})

onMounted(() => {
    subscribe({
        onTrafficUpdated: () => {
            console.log('⚡ Traffic updated -> Refreshing Data')
            refreshAllData()
        },
        onAccidentCreated: () => refreshAllData(),
        onAccidentUpdated: () => refreshAllData(),
        onAccidentDeleted: () => refreshAllData(),
    })
})

onUnmounted(() => {
    unsubscribe()
})
</script>
