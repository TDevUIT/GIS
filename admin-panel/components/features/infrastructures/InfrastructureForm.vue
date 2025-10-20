<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-300">Name</label>
                <input v-model="formState.name" type="text" id="name" required class="mt-1 block w-full form-input" />
            </div>
            <div>
                <label for="address" class="block text-sm font-medium text-gray-300">Address</label>
                <input v-model="formState.address" type="text" id="address" class="mt-1 block w-full form-input" />
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
                <label for="category" class="block text-sm font-medium text-gray-300">Category</label>
                <select v-model="formState.category" id="category" required class="mt-1 block w-full form-select">
                    <option disabled value="">Select a category</option>
                    <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                        {{ cat.label }}
                    </option>
                </select>
            </div>
        </div>
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-4">Category Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <template v-if="formState.category === 'SCHOOL'">
                    <div>
                        <label for="schoolLevel" class="block text-sm font-medium text-gray-300">School Level</label>
                        <select v-model="formState.school.level" id="schoolLevel" class="mt-1 block w-full form-select">
                            <option value="PRIMARY">Primary</option>
                            <option value="SECONDARY">Secondary</option>
                            <option value="HIGH_SCHOOL">High School</option>
                        </select>
                    </div>
                    <div>
                        <label for="studentCapacity" class="block text-sm font-medium text-gray-300">Student Capacity</label>
                        <input v-model.number="formState.school.studentCapacity" type="number" id="studentCapacity" class="mt-1 block w-full form-input" />
                    </div>
                </template>
                <template v-if="formState.category === 'HOSPITAL'">
                    <div>
                        <label for="hospitalType" class="block text-sm font-medium text-gray-300">Hospital Type</label>
                        <select v-model="formState.hospital.type" id="hospitalType" class="mt-1 block w-full form-select">
                            <option value="GENERAL">General</option>
                            <option value="SPECIALIZED">Specialized</option>
                        </select>
                    </div>
                    <div>
                        <label for="bedCapacity" class="block text-sm font-medium text-gray-300">Bed Capacity</label>
                        <input v-model.number="formState.hospital.bedCapacity" type="number" id="bedCapacity" class="mt-1 block w-full form-input" />
                    </div>
                </template>
                <template v-if="formState.category === 'MARKET'">
                    <div>
                        <label for="marketType" class="block text-sm font-medium text-gray-300">Market Type</label>
                        <select v-model="formState.market.type" id="marketType" class="mt-1 block w-full form-select">
                            <option value="TRADITIONAL">Traditional</option>
                            <option value="SUPERMARKET">Supermarket</option>
                        </select>
                    </div>
                    <div>
                        <label for="stallCount" class="block text-sm font-medium text-gray-300">Stall Count</label>
                        <input v-model.number="formState.market.stallCount" type="number" id="stallCount" class="mt-1 block w-full form-input" />
                    </div>
                </template>
                <template v-if="formState.category === 'PARK'">
                    <div>
                        <label for="parkArea" class="block text-sm font-medium text-gray-300">Area (m²)</label>
                        <input v-model.number="formState.park.area" type="number" id="parkArea" class="mt-1 block w-full form-input" />
                    </div>
                </template>
            </div>
        </div>
        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Location</h3>
            <p class="text-sm text-gray-400 mb-4">Enter coordinates in Longitude, Latitude format. Example: 106.7009, 10.7769</p>
            <div>
                <label for="geom" class="block text-sm font-medium text-gray-300">Coordinates (Lng, Lat)</label>
                <input v-model="geomString" type="text" id="geom" placeholder="e.g., 106.7009, 10.7769" required class="mt-1 block w-full form-input" />
            </div>
        </div>
        <div class="flex justify-end pt-4">
            <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ initialData ? 'Update Infrastructure' : 'Create Infrastructure' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Infrastructure, CreateInfrastructureDTO } from '~/types/api/infrastructure';
import type { District } from '~/types/api/district';

const props = defineProps<{
    initialData?: Infrastructure | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const categoryOptions = [
    { value: 'SCHOOL', label: 'School' },
    { value: 'HOSPITAL', label: 'Hospital' },
    { value: 'MARKET', label: 'Market' },
    { value: 'PARK', label: 'Park' },
    { value: 'UTILITY', label: 'Utility' },
];

const createInitialFormState = () => ({
    name: props.initialData?.name || '',
    address: props.initialData?.address || '',
    districtId: props.initialData?.districtId || '',
    category: props.initialData?.category || '',
    school: {
        level: props.initialData?.school?.level || 'PRIMARY',
        studentCapacity: props.initialData?.school?.studentCapacity || null,
    },
    hospital: {
        type: props.initialData?.hospital?.type || 'GENERAL',
        bedCapacity: props.initialData?.hospital?.bedCapacity || null,
    },
    market: {
        type: props.initialData?.market?.type || 'TRADITIONAL',
        stallCount: props.initialData?.market?.stallCount || null,
    },
    park: {
        area: props.initialData?.park?.area || null,
    },
    utility: {
        type: props.initialData?.utility?.type || 'POWER',
        capacity: props.initialData?.utility?.capacity || null,
    },
});

const formState = reactive(createInitialFormState());
const geomString = ref('');

const parseGeomForInput = (geom: any) => {
    if (geom && geom.type === 'Point' && Array.isArray(geom.coordinates)) {
        return `${geom.coordinates[0]}, ${geom.coordinates[1]}`;
    }
    return '';
};

if (props.initialData?.geom) {
    geomString.value = parseGeomForInput(props.initialData.geom);
}

watch(() => props.initialData, () => {
    Object.assign(formState, createInitialFormState());
    geomString.value = parseGeomForInput(props.initialData?.geom);
}, { deep: true });

function onFormSubmit() {
    const coords = geomString.value.split(',').map(s => s.trim());
    const lng = parseFloat(coords[0]);
    const lat = parseFloat(coords[1]);

    if (isNaN(lng) || isNaN(lat)) {
        alert('Invalid coordinates format. Please use "longitude, latitude".');
        return;
    }
    const payload: CreateInfrastructureDTO = {
        name: formState.name,
        address: formState.address,
        districtId: formState.districtId,
        category: formState.category as any,
        school: formState.category === 'SCHOOL' ? formState.school : null,
        hospital: formState.category === 'HOSPITAL' ? formState.hospital : null,
        market: formState.category === 'MARKET' ? formState.market : null,
        park: formState.category === 'PARK' ? formState.park : null,
        utility: formState.category === 'UTILITY' ? formState.utility : null,
        geom: JSON.stringify({ type: 'Point', coordinates: [lng, lat] }),
    };
    emit('submit', payload);
}
</script>

<style scoped>
.form-input, .form-select {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
.form-select option {
    background-color: #1f2937;
    color: white;
}
</style>
