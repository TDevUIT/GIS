<template>
    <form @submit.prevent="onFormSubmit" class="space-y-8">
        <div class="p-6 rounded-lg border border-gray-700 bg-gray-800/50">
            <h2 class="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-4">Main Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="districtId" class="block text-sm font-medium text-gray-300">District</label>
                    <select v-model="formState.districtId" id="districtId" required class="mt-1 block w-full form-select">
                        <option disabled value="">Select a district</option>
                        <option v-for="district in districts" :key="district.id" :value="district.id">{{ district.name }}</option>
                    </select>
                </div>
                <div>
                    <label for="year" class="block text-sm font-medium text-gray-300">Year</label>
                    <input v-model.number="formState.year" type="number" id="year" required class="mt-1 block w-full form-input" />
                </div>
                <div>
                    <label for="populationTotal" class="block text-sm font-medium text-gray-300">Total Population</label>
                    <input v-model.number="formState.populationTotal" type="number" id="populationTotal" required class="mt-1 block w-full form-input" />
                </div>
                <div>
                    <label for="householdsTotal" class="block text-sm font-medium text-gray-300">Total Households</label>
                    <input v-model.number="formState.householdsTotal" type="number" id="householdsTotal" required class="mt-1 block w-full form-input" />
                </div>
            </div>
        </div>

        <div class="p-6 rounded-lg border border-gray-700 bg-gray-800/50">
            <div class="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                <h2 class="text-lg font-semibold text-white">Demographics (by Age Group)</h2>
                <button type="button" @click="addDemographic" class="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    <PlusCircleIcon class="h-5 w-5" />
                    Add Group
                </button>
            </div>
            <div v-if="formState.demographics?.length === 0" class="text-center text-gray-500 py-4">No demographic groups added.</div>
            <div v-for="(demo, index) in formState.demographics" :key="`demo-${index}`" class="grid grid-cols-12 gap-4 items-center mb-3">
                <div class="col-span-12 sm:col-span-5 grid grid-cols-2 gap-2">
                    <input v-model.number="demo.ageMin" type="number" placeholder="From Age" required class="form-input" />
                    <input v-model.number="demo.ageMax" type="number" placeholder="To Age" class="form-input" />
                </div>
                <input v-model.number="demo.male" type="number" placeholder="Male Count" required class="col-span-5 sm:col-span-3 form-input" />
                <input v-model.number="demo.female" type="number" placeholder="Female Count" required class="col-span-5 sm:col-span-3 form-input" />
                <button type="button" @click="removeDemographic(index)" class="col-span-2 sm:col-span-1 text-red-400 hover:text-red-300 flex justify-center">
                    <TrashIcon class="h-5 w-5" />
                </button>
            </div>
        </div>

        <div class="p-6 rounded-lg border border-gray-700 bg-gray-800/50">
            <div class="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                <h2 class="text-lg font-semibold text-white">Households Details</h2>
                <button type="button" @click="addHousehold" class="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    <PlusCircleIcon class="h-5 w-5" />
                    Add Household
                </button>
            </div>
            <div v-if="formState.households?.length === 0" class="text-center text-gray-500 py-4">No household data added.</div>
            <div v-for="(household, index) in formState.households" :key="`hh-${index}`" class="grid grid-cols-12 gap-4 items-center mb-3">
                <input v-model.number="household.householdSize" type="number" placeholder="Household Size" required class="col-span-12 sm:col-span-3 form-input" />
                <select v-model="household.incomeLevel" class="col-span-6 sm:col-span-4 form-select">
                    <option :value="null" disabled>Income Level</option>
                    <option v-for="option in incomeLevelOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
                <select v-model="household.housingType" class="col-span-6 sm:col-span-4 form-select">
                    <option :value="null" disabled>Housing Type</option>
                    <option v-for="option in housingTypeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
                <button type="button" @click="removeHousehold(index)" class="col-span-12 sm:col-span-1 text-red-400 hover:text-red-300 flex justify-center sm:justify-end">
                    <TrashIcon class="h-5 w-5" />
                </button>
            </div>
        </div>

        <div class="flex justify-end pt-4">
            <NuxtLink to="/populations" class="text-sm font-semibold leading-6 text-gray-300 mr-6">Cancel</NuxtLink>
            <button type="submit" :disabled="isSubmitting" class="form-submit-button">
                {{ isSubmitting ? 'Saving...' : (initialData ? 'Update Data' : 'Create Data') }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import type { Population, CreatePopulationDTO } from '~/types/api/population';
import { IncomeLevel, HousingType } from '~/types/api/population';
import type { District } from '~/types/api/district';

const props = defineProps<{
    initialData?: Population | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const incomeLevelOptions = [
    { value: IncomeLevel.Thap, text: 'Thấp' },
    { value: IncomeLevel.TrungBinh, text: 'Trung bình' },
    { value: IncomeLevel.Cao, text: 'Cao' }
];

const housingTypeOptions = [
    { value: HousingType.NhaRieng, text: 'Nhà riêng' },
    { value: HousingType.ChungCuCaoCap, text: 'Chung cư cao cấp' },
    { value: HousingType.NhaTrongHem, text: 'Nhà trong hẻm' },
    { value: HousingType.NhaTro, text: 'Nhà trọ' }
];

const formState = reactive<CreatePopulationDTO>({
    year: props.initialData?.year || new Date().getFullYear(),
    populationTotal: props.initialData?.populationTotal || 0,
    householdsTotal: props.initialData?.householdsTotal || 0,
    districtId: props.initialData?.districtId || '',
    demographics: props.initialData?.demographics?.map(d => ({
        ageMin: d.ageMin,
        ageMax: d.ageMax ?? null,
        male: d.male,
        female: d.female
    })) || [],
    households: props.initialData?.households?.map(h => ({
        householdSize: h.householdSize || 1,
        incomeLevel: h.incomeLevel,
        housingType: h.housingType
    })) || [],
});

function addDemographic() {
    formState.demographics?.push({ ageMin: 0, ageMax: null, male: 0, female: 0 });
}
function removeDemographic(index: number) {
    formState.demographics?.splice(index, 1);
}

function addHousehold() {
    formState.households?.push({ householdSize: 1, incomeLevel: null, housingType: null });
}
function removeHousehold(index: number) {
    formState.households?.splice(index, 1);
}

function onFormSubmit() {
    const submissionData = JSON.parse(JSON.stringify(formState));
    if (submissionData.demographics) {
        submissionData.demographics = submissionData.demographics.map((d: any) => ({
            ...d,
            ageMax: d.ageMax === '' || d.ageMax === undefined ? null : Number(d.ageMax)
        }));
    }
    const cleanedHouseholds = submissionData.households?.filter(
        (h: any) => h.householdSize > 0 && h.incomeLevel && h.housingType
    );
    emit('submit', { ...submissionData, households: cleanedHouseholds });
}
</script>

<style scoped>
.form-input, .form-select {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm;
}
.form-select option {
    background-color: #1f2937;
    color: white;
}
.form-submit-button {
    @apply rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50;
}
</style>
