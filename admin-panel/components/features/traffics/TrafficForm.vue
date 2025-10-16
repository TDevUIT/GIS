<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="roadName" class="block text-sm font-medium text-gray-300">Road Name</label>
                <input v-model="formState.roadName" type="text" id="roadName" required class="mt-1 block w-full form-input" />
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
                <label for="lengthKm" class="block text-sm font-medium text-gray-300">Length (km)</label>
                <input v-model.number="formState.lengthKm" type="number" id="lengthKm" step="0.01" class="mt-1 block w-full form-input" />
            </div>
        </div>
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Geometry Data (WKT)</h3>
            <p class="text-sm text-gray-400 mb-4">Paste the Well-Known Text (WKT) string for the LineString.</p>
            <div>
                <label for="geom" class="block text-sm font-medium text-gray-300">WKT LineString</label>
                <textarea v-model="wktString" id="geom" rows="8" required class="mt-1 block w-full form-input font-mono"></textarea>
            </div>
        </div>
        <div class="flex justify-end pt-4">
            <NuxtLink to="/traffics" class="form-cancel-button">Cancel</NuxtLink>
            <button
                type="submit"
                :disabled="isSubmitting"
                class="form-submit-button"
            >
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ initialData ? 'Update Route' : 'Create Route' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { Traffic, CreateTrafficDTO } from '~/types/api/traffic';
import type { District } from '~/types/api/district';
import { wktToGeoJsonString, geoJsonToWkt } from '~/utils/wkt-parser';

const props = defineProps<{
    initialData?: Traffic | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const createInitialState = () => ({
    roadName: props.initialData?.roadName || '',
    districtId: props.initialData?.districtId || '',
    lengthKm: props.initialData?.lengthKm ?? undefined,
    trafficVolume: props.initialData?.trafficVolume ?? undefined
});

const formState = reactive(createInitialState());
const wktString = ref(geoJsonToWkt(props.initialData?.geom));

watch(() => props.initialData, (newData) => {
    Object.assign(formState, createInitialState());
    wktString.value = geoJsonToWkt(newData?.geom);
}, { deep: true });

function onFormSubmit() {
    if (!wktString.value || !wktString.value.toUpperCase().startsWith('LINESTRING')) {
        alert('Invalid WKT LineString format.');
        return;
    }
    const payload: CreateTrafficDTO = {
        ...formState,
        geom: wktString.value,
    };
    emit('submit', payload);
}
</script>

<style scoped>
.form-input,
.form-select {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
.form-submit-button {
    @apply ml-4 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50;
}
.form-cancel-button {
    @apply rounded-md border border-gray-600 bg-transparent py-2 px-4 text-sm font-medium text-gray-300 hover:bg-gray-700;
}
</style>
