<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="planName" class="block text-sm font-medium text-gray-300">Plan Name</label>
                <input v-model="formState.planName" type="text" id="planName" required class="mt-1 block w-full form-input" />
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
                <label for="zoningType" class="block text-sm font-medium text-gray-300">Zoning Type</label>
                <input v-model="formState.zoningType" type="text" id="zoningType" required placeholder="e.g., Residential" class="mt-1 block w-full form-input" />
            </div>
            <div>
                <label for="issuedDate" class="block text-sm font-medium text-gray-300">Issued Date</label>
                <input v-model="formState.issuedDate" type="date" id="issuedDate" required class="mt-1 block w-full form-input" />
            </div>
        </div>
        <div>
            <label for="description" class="block text-sm font-medium text-gray-300">Description</label>
            <textarea v-model="formState.description" id="description" rows="3" class="mt-1 block w-full form-input"></textarea>
        </div>
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Geometry Data (WKT)</h3>
            <p class="text-sm text-gray-400 mb-4">Paste the Well-Known Text (WKT) string for the polygon.</p>
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
                <span v-else>{{ initialData ? 'Update Urban Plan' : 'Create Urban Plan' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue';
import type { UrbanPlan, CreateUrbanPlanDTO } from '~/types/api/urban-plan';
import type { District } from '~/types/api/district';
import { wktToGeoJsonString, geoJsonToWkt } from '~/utils/wkt-parser';

const props = defineProps<{
    initialData?: UrbanPlan | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const createInitialFormState = () => ({
    planName: props.initialData?.planName || '',
    zoningType: props.initialData?.zoningType || '',
    description: props.initialData?.description || '',
    issuedDate: props.initialData?.issuedDate ? new Date(props.initialData.issuedDate).toISOString().split('T')[0] : '',
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
        alert('Invalid WKT Polygon format.');
        return;
    }

    const payload: CreateUrbanPlanDTO = {
        ...formState,
        issuedDate: new Date(formState.issuedDate ?? '').toISOString(),
        geom: geoJsonString,
    };

    emit('submit', payload);
}
</script>

<style scoped>
.form-input {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
.form-select {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
</style>
