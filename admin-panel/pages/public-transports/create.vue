<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/public-transports" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Add New Public Transport Route</h1>
        </header>
        <div v-if="districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesPublicTransportsPublicTransportForm
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
        <div v-else class="text-center py-10 text-gray-400">Loading form...</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { CreatePublicTransportDTO } from '~/types/api/public-transport';

useHead({ title: 'Add Public Transport Route' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: districts } = useAsyncData('districts-for-form', async () => extractData(await $api.districts.getAll()));

async function handleSubmit(formData: CreatePublicTransportDTO) {
    isSubmitting.value = true;
    try {
        await $api.publicTransports.create(formData);
        toastSuccess('Route created successfully!');
        router.push('/public-transports');
    } catch (err: any) {
        toastError('Creation failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
