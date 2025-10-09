<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/districts" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Districts
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit District</h1>
            <p class="mt-1 text-sm text-gray-400">Update the details for "{{ district?.data.data.name }}".</p>
        </header>

        <div v-if="pending" class="text-center py-10">Loading district data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data.</div>

        <div v-else-if="district" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesDistrictsDistrictForm
                :initial-data="district.data.data"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { UpdateDistrictDTO } from '~/types/api/district';

const route = useRoute();
const districtId = route.params.id as string;

useHead({ title: `Edit District` });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const { data: district, pending, error } = await useAsyncData(
    `district-${districtId}`,
    () => $api.districts.getById(districtId)
);

async function handleSubmit(formData: UpdateDistrictDTO) {
    isSubmitting.value = true;
    try {
        const payload: UpdateDistrictDTO = {
            name: formData.name,
            code: formData.code,
            geom: formData.geom,
            areaKm2: formData.areaKm2,
            densityPerKm2: formData.densityPerKm2,
        };
        Object.keys(payload).forEach(key => {
            if (payload[key as keyof UpdateDistrictDTO] === undefined || payload[key as keyof UpdateDistrictDTO] === null) {
                delete payload[key as keyof UpdateDistrictDTO];
            }
        });
        await $api.districts.update(districtId, payload);
        toastSuccess('District updated successfully!');
        router.push('/districts');
    } catch (err: any) {
        const message = Array.isArray(err.data?.message) ? err.data.message.join(', ') : err.data?.message;
        toastError('Update failed', message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
