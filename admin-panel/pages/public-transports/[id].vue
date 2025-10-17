<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/public-transports" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Public Transport Route</h1>
        </header>
        <div v-if="pending" class="text-center py-10 text-gray-400">Loading data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data.</div>
        <div v-else-if="routeData && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesPublicTransportsPublicTransportForm
                :initial-data="routeData"
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { UpdatePublicTransportDTO } from '~/types/api/public-transport';

const route = useRoute();
const routeId = route.params.id as string;
useHead({ title: 'Edit Public Transport Route' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const { data: pageData, pending, error } = await useAsyncData(`publictransport-edit-${routeId}`, async () => {
    const [routeRes, districtsRes] = await Promise.all([
        $api.publicTransports.getById(routeId),
        $api.districts.getAll()
    ]);
    const data = routeRes.data.data;
    if (data && typeof data.geom === 'string') {
        data.geom = JSON.parse(data.geom);
    }
    return { routeData: data, districts: districtsRes.data.data };
});

const routeData = computed(() => pageData.value?.routeData);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdatePublicTransportDTO) {
    isSubmitting.value = true;
    try {
        await $api.publicTransports.update(routeId, formData);
        toastSuccess('Route updated successfully!');
        router.push('/public-transports');
    } catch (err: any) {
        toastError('Update failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
