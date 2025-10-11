<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="type" class="block text-sm font-medium text-gray-300">Land Use Type</label>
                <input v-model="formState.type" type="text" id="type" required placeholder="e.g., Đất ở đô thị" class="mt-1 block w-full form-input" />
            </div>
            <div>
                <label for="districtId" class="block text-sm font-medium text-gray-300">District</label>
                <select v-model="formState.districtId" id="districtId" required class="mt-1 block w-full form-select">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                        {{ district.name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="areaKm2" class="block text-sm font-medium text-gray-300">Area (km²)</label>
                <input v-model.number="formState.areaKm2" type="number" step="0.01" id="areaKm2" required class="mt-1 block w-full form-input" />
            </div>
            <div>
                <label for="year" class="block text-sm font-medium text-gray-300">Year</label>
                <input v-model.number="formState.year" type="number" id="year" required placeholder="e.g., 2023" class="mt-1 block w-full form-input" />
            </div>
        </div>
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Geometry Data (WKT)</h3>
            <p class="text-sm text-gray-400 mb-4">Paste the Well-Known Text (WKT) string for the polygon. e.g., POLYGON((lng lat, ...))</p>
            <div>
                <label for="geom" class="block text-sm font-medium text-gray-300">WKT Polygon</label>
                <textarea v-model="wktString" id="geom" rows="8" required class="mt-1 block w-full form-input font-mono"></textarea>
            </div>
        </div>
        <div class="flex justify-end pt-4">
            <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ initialData ? 'Update Land Use' : 'Create Land Use' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { LandUse, CreateLandUseDTO } from '~/types/api/land-use';
import type { District } from '~/types/api/district';

const props = defineProps<{
    initialData?: LandUse | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

function geoJsonToWkt(geoJson: any): string {
    if (!geoJson || geoJson.type !== 'Polygon' || !geoJson.coordinates) {
        return '';
    }
    const coordsString = geoJson.coordinates[0]
        .map((coord: number[]) => `${coord[0]} ${coord[1]}`)
        .join(',');
    return `POLYGON((${coordsString}))`;
}

function wktToGeoJsonString(wkt: string): string | null {
    try {
        const coordsMatch = wkt.match(/POLYGON\s*\(\((.*)\)\)/i);
        if (!coordsMatch || !coordsMatch[1]) {
            throw new Error('Invalid WKT Polygon format');
        }
        const coordPairs = coordsMatch[1].split(',');
        const coordinates = coordPairs.map(pair => {
            const [lng, lat] = pair.trim().split(/\s+/).map(Number);
            if (isNaN(lng) || isNaN(lat)) {
                throw new Error('Invalid coordinate pair');
            }
            return [lng, lat];
        });
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
           coordinates.push(first);
        }
        const geoJson = {
            type: 'Polygon',
            coordinates: [coordinates]
        };
        return JSON.stringify(geoJson);
    } catch (e) {
        console.error("WKT parsing error:", e);
        return null;
    }
}

const createInitialFormState = () => ({
    type: props.initialData?.type || '',
    areaKm2: props.initialData?.areaKm2 || 0,
    year: props.initialData?.year || new Date().getFullYear(),
    districtId: props.initialData?.districtId || '',
});

const formState = reactive(createInitialFormState());
const wktString = ref(geoJsonToWkt(props.initialData?.geom));

watch(() => props.initialData, (newData) => {
    Object.assign(formState, createInitialFormState());
    wktString.value = geoJsonToWkt(newData?.geom);
}, { deep: true });

function onFormSubmit() {
    const geoJsonString = wktToGeoJsonString(wktString.value);
    if (!geoJsonString) {
        alert('Invalid WKT Polygon format. Please check the geometry data.');
        return;
    }
    const payload: CreateLandUseDTO = {
        type: formState.type,
        areaKm2: formState.areaKm2,
        year: formState.year,
        districtId: formState.districtId,
        geom: geoJsonString,
    };
    emit('submit', payload);
}
</script>

<style scoped>
.form-input, .form-select {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
</style>
