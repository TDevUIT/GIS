<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/traffics" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Traffic Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Traffic Route</h1>
            <p v-if="traffic" class="mt-1 text-sm text-gray-400">Updating details for "{{ traffic.roadName }}".</p>
        </header>
        <div v-if="pending" class="text-center py-10 text-gray-400">Loading data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data.</div>
        <div v-else-if="traffic && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesTrafficsTrafficForm
                :initial-data="traffic"
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
import type { UpdateTrafficDTO } from '~/types/api/traffic';

const route = useRoute();
const trafficId = route.params.id as string;
useHead({ title: 'Edit Traffic Route' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: pageData, pending, error } = await useAsyncData(`traffic-edit-${trafficId}`, async () => {
    const [trafficRes, districtsRes] = await Promise.all([
        $api.traffics.getById(trafficId),
        $api.districts.getAll()
    ]);
    const trafficData = extractData(trafficRes);
    if (trafficData && typeof trafficData.geom === 'string') {
        trafficData.geom = JSON.parse(trafficData.geom);
    }
    return { traffic: trafficData, districts: extractData(districtsRes) };
});

const traffic = computed(() => pageData.value?.traffic);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdateTrafficDTO) {
    isSubmitting.value = true;
    try {
        await $api.traffics.update(trafficId, formData);
        toastSuccess('Traffic route updated successfully!');
        router.push('/traffics');
    } catch (err: any) {
        toastError('Update failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
