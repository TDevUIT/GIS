<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="routeName" class="form-label">Route Name</label>
                <input v-model="formState.routeName" type="text" id="routeName" required class="form-input" />
            </div>
            <div>
                <label for="districtId" class="form-label">District</label>
                <select v-model="formState.districtId" id="districtId" required class="form-select">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                        {{ district.name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="mode" class="form-label">Transport Mode</label>
                <select v-model="formState.mode" id="mode" required class="form-select">
                     <option disabled value="">Select a mode</option>
                     <option v-for="mode in transportModes" :key="mode" :value="mode">{{ mode }}</option>
                </select>
            </div>
             <div>
                <label for="capacity" class="form-label">Capacity (passengers)</label>
                <input v-model.number="formState.capacity" type="number" id="capacity" class="form-input" />
            </div>
            <div>
                <label for="stopsCount" class="form-label">Number of Stops</label>
                <input v-model.number="formState.stopsCount" type="number" id="stopsCount" class="form-input" />
            </div>
            <div>
                <label for="frequencyMin" class="form-label">Frequency (minutes/trip)</label>
                <input v-model.number="formState.frequencyMin" type="number" id="frequencyMin" class="form-input" />
            </div>
            <div class="md:col-span-2">
                <label for="operatingHours" class="form-label">Operating Hours</label>
                <input v-model="formState.operatingHours" type="text" id="operatingHours" placeholder="e.g., 05:00 - 22:00" class="form-input" />
            </div>
        </div>
        
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Geometry Data (WKT)</h3>
            <p class="text-sm text-gray-400 mb-4">Paste the Well-Known Text (WKT) string for the LineString.</p>
            <textarea v-model="wktString" rows="8" required class="w-full form-input font-mono"></textarea>
        </div>
        <div class="flex justify-end pt-4 gap-4">
            <NuxtLink to="/public-transports" class="form-cancel-button">Cancel</NuxtLink>
            <button type="submit" :disabled="isSubmitting" class="form-submit-button">
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ initialData ? 'Update Route' : 'Create Route' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { PublicTransport, CreatePublicTransportDTO } from '~/types/api/public-transport';
import { TransportMode } from '~/types/api/shared';
import type { District } from '~/types/api/district';
import { wktToGeoJsonString, geoJsonToWkt } from '~/utils/wkt-parser';

const props = defineProps<{
    initialData?: PublicTransport | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const transportModes = Object.values(TransportMode);

const createInitialState = () => ({
    routeName: props.initialData?.routeName || '',
    districtId: props.initialData?.districtId || '',
    mode: props.initialData?.mode || '',
    capacity: props.initialData?.capacity ?? undefined,
    stopsCount: props.initialData?.stopsCount ?? undefined,
    frequencyMin: props.initialData?.frequencyMin ?? undefined,
    operatingHours: props.initialData?.operatingHours || '',
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
    
    const payload: CreatePublicTransportDTO = {
        ...formState,
        mode: formState.mode as TransportMode,
        geom: wktString.value,
    };
    emit('submit', payload);
}
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-300 mb-1; }
.form-input, .form-select { @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6; }
.form-submit-button { @apply inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50; }
.form-cancel-button { @apply rounded-md border border-gray-600 bg-transparent py-2 px-4 text-sm font-medium text-gray-300 hover:bg-gray-700; }
.form-select option {
    background-color: #1f2937;
    color: white;
}
</style>
