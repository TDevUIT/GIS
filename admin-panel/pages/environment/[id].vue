<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/environment" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Environment Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Environment Record</h1>
            <p v-if="recordData" class="mt-1 text-sm text-gray-400">Updating {{ recordData.type }} quality record recorded at {{ new Date(recordData.recordedAt).toLocaleString() }}.</p>
        </header>
        <div v-if="pending" class="text-center py-10 text-gray-400">Loading data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data.</div>
        <div v-else-if="recordData && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <!-- SỬA LẠI TÊN COMPONENT Ở ĐÂY -->
            <FeaturesEnvironmentForm
                :initial-data="recordData"
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// ... script không thay đổi ...
import { ref, computed } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { UpdateAirQualityDTO } from '~/types/api/air-quality';
import type { UpdateWaterQualityDTO } from '~/types/api/water-quality';

const route = useRoute();
const recordId = route.params.id as string;
const recordType = route.query.type as 'air' | 'water';

if (!recordType) {
    navigateTo('/environment');
}

useHead({ title: `Edit ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record` });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: pageData, pending, error } = await useAsyncData(`env-edit-${recordId}`, async () => {
    const api = recordType === 'air' ? $api.airQualities : $api.waterQualities;

    const [recordRes, districtsRes] = await Promise.all([
        api.getById(recordId),
        $api.districts.getAll()
    ]);

    const data = extractData(recordRes);
    if (data && typeof data.geom === 'string') {
        data.geom = JSON.parse(data.geom);
    }

    return {
        recordData: { ...data, type: recordType },
        districts: extractData(districtsRes)
    };
});

const recordData = computed(() => pageData.value?.recordData);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit({ type, payload }: { type: 'air' | 'water', payload: UpdateAirQualityDTO | UpdateWaterQualityDTO }) {
    isSubmitting.value = true;
    try {
        if (type === 'air') {
            await $api.airQualities.update(recordId, payload as UpdateAirQualityDTO);
        } else {
            await $api.waterQualities.update(recordId, payload as UpdateWaterQualityDTO);
        }
        toastSuccess('Record updated successfully!');
        router.push('/environment');
    } catch (err: any) {
        toastError('Update failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
