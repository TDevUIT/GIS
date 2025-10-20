<template>
    <form @submit.prevent="onFormSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="form-label">Measurement Type</label>
                <div class="flex gap-4 mt-2">
                    <button type="button" @click="type = 'air'" :class="type === 'air' ? 'btn-primary' : 'btn-secondary'" :disabled="!!initialData">Air Quality</button>
                    <button type="button" @click="type = 'water'" :class="type === 'water' ? 'btn-primary' : 'btn-secondary'" :disabled="!!initialData">Water Quality</button>
                </div>
            </div>
            <div>
                <label for="districtId" class="form-label">District</label>
                <select v-model="formState.districtId" id="districtId" required class="form-select">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district.id" :value="district.id">{{ district.name }}</option>
                </select>
            </div>
            <div>
                <label for="recordedAt" class="form-label">Recorded At</label>
                <input v-model="formState.recordedAt" type="datetime-local" id="recordedAt" required class="form-input" />
            </div>
        </div>

        <div v-if="type === 'air'" class="space-y-4 border-t border-gray-700 pt-4">
            <div>
                <label for="pm25" class="form-label">PM2.5 (µg/m³)</label>
                <input v-model.number="formState.pm25" type="number" step="0.1" id="pm25" class="form-input" />
            </div>
            <div>
                <label for="co2" class="form-label">CO2 (ppm)</label>
                <input v-model.number="formState.co2" type="number" step="0.1" id="co2" class="form-input" />
            </div>
            <div>
                <label for="no2" class="form-label">NO2 (ppb)</label>
                <input v-model.number="formState.no2" type="number" step="0.1" id="no2" class="form-input" />
            </div>
        </div>

        <div v-if="type === 'water'" class="space-y-4 border-t border-gray-700 pt-4">
            <div>
                <label for="ph" class="form-label">pH</label>
                <input v-model.number="formState.ph" type="number" step="0.1" id="ph" class="form-input" />
            </div>
            <div>
                <label for="turbidity" class="form-label">Turbidity (NTU)</label>
                <input v-model.number="formState.turbidity" type="number" step="0.1" id="turbidity" class="form-input" />
            </div>
            <div>
                <label for="contaminationIndex" class="form-label">Contamination Index</label>
                <input v-model.number="formState.contaminationIndex" type="number" step="0.1" id="contaminationIndex" class="form-input" />
            </div>
        </div>

        <div class="border-t border-gray-700 pt-6 mt-6">
            <h3 class="text-lg font-medium text-white mb-2">Location (WKT)</h3>
            <textarea v-model="wktString" rows="3" required placeholder="POINT(106.701 10.776)" class="w-full form-input font-mono"></textarea>
        </div>

        <div class="flex justify-end pt-4 gap-4">
            <NuxtLink to="/environment" class="form-cancel-button">Cancel</NuxtLink>
            <button type="submit" :disabled="isSubmitting" class="form-submit-button">
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ initialData ? 'Update Record' : 'Create Record' }}</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue';
import type { District } from '~/types/api/district';
import type { CreateAirQualityDTO } from '~/types/api/air-quality';
import type { CreateWaterQualityDTO } from '~/types/api/water-quality';
import { geoJsonToWkt } from '~/utils/wkt-parser';
import { formatISOForInput, parseISOFromInput } from '~/utils/formatters';

type RecordType = 'air' | 'water';

const props = defineProps<{
    initialData?: (any & { type: RecordType }) | null;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

// Khởi tạo state rỗng ban đầu
const formState = reactive<any>({
    districtId: '',
    recordedAt: '',
    pm25: undefined,
    co2: undefined,
    no2: undefined,
    ph: undefined,
    turbidity: undefined,
    contaminationIndex: undefined,
});

const type = ref<RecordType>('air');
const wktString = ref('');

// ================= THE FIX STARTS HERE =================
// Hàm này sẽ được gọi để đồng bộ state với props
function syncStateWithProps(data: typeof props.initialData) {
    type.value = data?.type || 'air';
    wktString.value = geoJsonToWkt(data?.geom);
    formState.districtId = data?.districtId || '';
    formState.recordedAt = formatISOForInput(data?.recordedAt);
    formState.pm25 = data?.pm25 ?? undefined;
    formState.co2 = data?.co2 ?? undefined;
    formState.no2 = data?.no2 ?? undefined;
    formState.ph = data?.ph ?? undefined;
    formState.turbidity = data?.turbidity ?? undefined;
    formState.contaminationIndex = data?.contaminationIndex ?? undefined;
}

// Watcher giờ sẽ gọi hàm sync với dữ liệu mới
watch(() => props.initialData, (newData) => {
    syncStateWithProps(newData);
}, { deep: true, immediate: true }); // Thêm immediate: true để chạy ngay lần đầu tiên
// ================= THE FIX ENDS HERE =================

watch(type, (newType, oldType) => {
    if (oldType !== undefined && newType !== oldType) {
        if (newType === 'air') {
            formState.ph = undefined;
            formState.turbidity = undefined;
            formState.contaminationIndex = undefined;
        } else {
            formState.pm25 = undefined;
            formState.co2 = undefined;
            formState.no2 = undefined;
        }
    }
});

function onFormSubmit() {
    if (!wktString.value || !wktString.value.toUpperCase().startsWith('POINT')) {
        alert('Invalid WKT Point format.');
        return;
    }

    const commonPayload = {
        districtId: formState.districtId,
        recordedAt: parseISOFromInput(formState.recordedAt),
        geom: wktString.value,
    };

    let payload: CreateAirQualityDTO | CreateWaterQualityDTO;
    if (type.value === 'air') {
        payload = { ...commonPayload, pm25: formState.pm25, co2: formState.co2, no2: formState.no2 };
    } else {
        payload = { ...commonPayload, ph: formState.ph, turbidity: formState.turbidity, contaminationIndex: formState.contaminationIndex };
    }

    emit('submit', { type: type.value, payload });
}
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-300 mb-1; }
.form-input, .form-select { @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6; }
.btn-primary { @apply bg-blue-600 text-white px-4 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-secondary { @apply bg-gray-700 text-gray-300 px-4 py-2 text-sm rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed; }
.form-submit-button { @apply inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50; }
.form-cancel-button { @apply rounded-md border border-gray-600 bg-transparent py-2 px-4 text-sm font-medium text-gray-300 hover:bg-gray-700; }
.form-select option {
    background-color: #1f2937;
    color: white;
}
</style>
