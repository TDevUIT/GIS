<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label for="soilType" class="form-label">Soil Type</label>
                <input v-model="formState.soilType" type="text" id="soilType" class="form-input" />
            </div>
            <div>
                <label for="elevation" class="form-label">Elevation (meters)</label>
                <input v-model.number="formState.elevation" type="number" step="0.1" id="elevation" class="form-input" />
            </div>
            <div>
                <label for="slope" class="form-label">Slope (degrees)</label>
                <input v-model.number="formState.slope" type="number" step="0.1" id="slope" class="form-input" />
            </div>
        </div>
        
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Geometry Data (WKT)</h3>
            <p class="text-sm text-gray-400 mb-4">Paste the Well-Known Text (WKT) string for the Polygon.</p>
            <textarea v-model="wktString" rows="8" required class="w-full form-input font-mono" placeholder="POLYGON((...))"></textarea>
        </div>
        <div class="flex justify-end pt-4 gap-4">
            <NuxtLink to="/terrains" class="form-cancel-button">Cancel</NuxtLink>
            <button type="submit" :disabled="isSubmitting" class="form-submit-button">
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ initialData ? 'Update Terrain' : 'Create Terrain' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { Terrain, CreateTerrainDTO } from '~/types/api/terrain';
import type { District } from '~/types/api/district';
import { geoJsonToWkt } from '~/utils/wkt-parser';

const props = defineProps<{
    initialData?: Terrain | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const createInitialState = () => ({
    districtId: props.initialData?.districtId || '',
    elevation: props.initialData?.elevation ?? undefined,
    slope: props.initialData?.slope ?? undefined,
    soilType: props.initialData?.soilType || '',
});

const formState = reactive(createInitialState());
const wktString = ref(geoJsonToWkt(props.initialData?.geom));

watch(() => props.initialData, (newData) => {
    Object.assign(formState, createInitialState());
    wktString.value = geoJsonToWkt(newData?.geom);
}, { deep: true });

function onFormSubmit() {
    if (!wktString.value || !wktString.value.toUpperCase().startsWith('POLYGON')) {
        alert('Invalid WKT Polygon format.');
        return;
    }
    
    const payload: CreateTerrainDTO = {
        ...formState,
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
