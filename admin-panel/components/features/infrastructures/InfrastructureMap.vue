<template>
    <div class="relative h-full w-full rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
        <ClientOnly>
            <LMap ref="mapRef" :zoom="11" :center="[10.7769, 106.7009]" :options="{ zoomControl: false }">
                <LControlZoom position="topright" />
                <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    name="OpenStreetMap"
                    :visible="true"
                    layer-type="base"
                />
                <LTileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; CartoDB"
                    name="Dark Mode"
                    layer-type="base"
                />
                <LControlLayers position="topright" />
                <LMarker
                    v-for="infra in infrastructures"
                    :key="infra.id"
                    :lat-lng="parseCoordinates(infra.geom)"
                    :icon="createIcon(infra)"
                    @click="onMarkerClick(infra.id)"
                    @mouseover="onMarkerHover(infra.id, $event)"
                    @mouseout="onMarkerHover(null, $event)"
                >
                    <LPopup :options="{ minWidth: 250 }">
                        <div v-html="createPopupHtml(infra)"></div>
                    </LPopup>
                </LMarker>
            </LMap>
            <div v-if="!infrastructures || infrastructures.length === 0" class="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-[1000]">
                <p class="text-gray-400">No infrastructure data to display on the map.</p>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import type { Infrastructure, InfraCategory } from '~/types/api/infrastructure';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { LMap, LTileLayer, LMarker, LPopup, LControlLayers, LControlZoom } = await import('@vue-leaflet/vue-leaflet');

const props = defineProps<{
    infrastructures: Infrastructure[];
    selectedId: string | null;
    hoveredId: string | null;
}>();

const emit = defineEmits(['marker-click', 'marker-hover']);

const mapRef = ref<any>(null);
const mapInstance = ref<L.Map | null>(null);

onMounted(() => {
    mapInstance.value = mapRef.value?.mapObject;
    mapInstance.value?.whenReady(() => {
        fitBoundsToMarkers();
    });
});

const categoryStyles = {
    HOSPITAL: { color: "#EF4444" }, SCHOOL: { color: "#3B82F6" },
    MARKET: { color: "#EAB308" }, PARK: { color: "#22C55E" },
    UTILITY: { color: "#8B5CF6" }, ADMINISTRATIVE: { color: "#10B981" },
    OTHER: { color: "#6B7280" }
} as Record<InfraCategory, { color: string }>;

const iconCache = new Map<string, L.DivIcon>();

function createIcon(infra: Infrastructure): L.DivIcon {
    const isSelected = props.selectedId === infra.id;
    const isHovered = props.hoveredId === infra.id;
    const cacheKey = `${infra.category}-${isSelected}-${isHovered}`;

    if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey)!;
    }

    const style = categoryStyles[infra.category] || { color: "#9CA3AF" };
    const size = isSelected ? 48 : (isHovered ? 40 : 32);
    const pulseClass = isSelected ? 'animate-pulse' : '';

    const iconHtml = `
        <div class="marker-container ${pulseClass}" style="width:${size}px; height:${size}px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${style.color}" class="w-full h-full drop-shadow-lg">
                <path fill-rule="evenodd" d="M12 2a7 7 0 017 7c0 5-7 11-7 11S5 14 5 9a7 7 0 017-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" clip-rule="evenodd" />
            </svg>
        </div>
    `;

    const newIcon = L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-none',
        iconSize: [size, size],
        iconAnchor: [size / 2, size]
    });

    iconCache.set(cacheKey, newIcon);
    return newIcon;
}

function createPopupHtml(infra: Infrastructure): string {
    return `
        <div class="font-sans">
            <h3 class="font-bold text-base mb-1 text-gray-800">${infra.name}</h3>
            <div class="text-xs font-semibold inline-flex items-center rounded-full px-2.5 py-0.5" style="background-color:${categoryStyles[infra.category]?.color || '#9CA3AF'}20; color:${categoryStyles[infra.category]?.color || '#9CA3AF'};">
                ${infra.category}
            </div>
            <p class="text-sm text-gray-600 mt-2">${infra.address || 'No address provided'}</p>
        </div>
    `;
}

function parseCoordinates(geom: any): [number, number] {
    try {
        // SỬA Ở ĐÂY: Xử lý trường hợp geom là một chuỗi JSON
        const geomObject = typeof geom === 'string' ? JSON.parse(geom) : geom;

        if (geomObject && geomObject.type === 'Point' && Array.isArray(geomObject.coordinates)) {
            // GeoJSON là [lng, lat], Leaflet cần [lat, lng]
            return [geomObject.coordinates[1], geomObject.coordinates[0]];
        }
    } catch (e) {
        console.error("Failed to parse geometry:", geom, e);
    }
    return [10.7769, 106.7009]; // Trả về tọa độ mặc định nếu lỗi
}


function onMarkerClick(id: string) {
    emit('marker-click', id);
}

function onMarkerHover(id: string | null, event: L.LeafletMouseEvent) {
    emit('marker-hover', id);
    const marker = event.target as L.Marker;
    if (id) {
       marker.setZIndexOffset(1000);
    } else {
       marker.setZIndexOffset(0);
    }
}

function fitBoundsToMarkers() {
    if (!mapInstance.value || !props.infrastructures || props.infrastructures.length === 0) return;
    
    const validLatLngs = props.infrastructures
        .map(infra => parseCoordinates(infra.geom))
        .filter(coords => coords[0] !== 10.7769 || coords[1] !== 106.7009); // Lọc ra các tọa độ hợp lệ
    
    if (validLatLngs.length > 0) {
        mapInstance.value.flyToBounds(L.latLngBounds(validLatLngs), { padding: [50, 50], maxZoom: 16 });
    }
}

watch(() => props.infrastructures, () => {
    iconCache.clear();
    nextTick(() => {
        fitBoundsToMarkers();
    });
}, { deep: true });

watch(() => props.selectedId, (newId) => {
    if (!newId || !mapInstance.value) return;
    const infra = props.infrastructures.find(i => i.id === newId);
    if (infra) {
        const coords = parseCoordinates(infra.geom);
        mapInstance.value.flyTo(coords, 16);
        mapInstance.value.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                const markerCoords = layer.getLatLng();
                if (markerCoords.lat === coords[0] && markerCoords.lng === coords[1]) {
                    layer.openPopup();
                }
            }
        });
    }
});
</script>

<style>
.marker-container {
    transition: all 0.2s ease-in-out;
}
.leaflet-popup-content-wrapper {
    background-color: #f9fafb;
    color: #1f2937;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.leaflet-popup-tip {
    background-color: #f9fafb;
}
.leaflet-popup-close-button {
    color: #6b7280 !important;
}
.leaflet-popup-close-button:hover {
    color: #1f2937 !important;
}
</style>
