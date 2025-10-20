<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/environment" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Environment Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Add New Environment Record</h1>
            <p class="mt-1 text-sm text-gray-400">Add a new measurement point for Air or Water Quality.</p>
        </header>
        <div v-if="districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <!-- SỬA LẠI TÊN COMPONENT Ở ĐÂY -->
            <FeaturesEnvironmentForm
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
        <div v-else class="text-center py-10 text-gray-400">Loading form...</div>
    </div>
</template>

<script setup lang="ts">
// ... script không thay đổi ...
import { ref } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { CreateAirQualityDTO } from '~/types/api/air-quality';
import type { CreateWaterQualityDTO } from '~/types/api/water-quality';

useHead({ title: 'Add Environment Record' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const { data: districts } = useAsyncData('districts-for-env-form', async () => (await $api.districts.getAll()).data.data);

async function handleSubmit({ type, payload }: { type: 'air' | 'water', payload: CreateAirQualityDTO | CreateWaterQualityDTO }) {
    isSubmitting.value = true;
    try {
        if (type === 'air') {
            await $api.airQualities.create(payload as CreateAirQualityDTO);
        } else {
            await $api.waterQualities.create(payload as CreateWaterQualityDTO);
        }
        toastSuccess('Environment record created successfully!');
        router.push('/environment');
    } catch (err: any) {
        toastError('Creation failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
