<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/traffics" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Traffic Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Add New Traffic Route</h1>
            <p class="mt-1 text-sm text-gray-400">Define a new road for traffic and accident monitoring.</p>
        </header>
        <div v-if="districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesTrafficsTrafficForm
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
import type { CreateTrafficDTO } from '~/types/api/traffic';

useHead({ title: 'Add Traffic Route' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: districts } = useAsyncData('districts-for-traffic-form', async () => extractData(await $api.districts.getAll()));

async function handleSubmit(formData: CreateTrafficDTO) {
    isSubmitting.value = true;
    try {
        await $api.traffics.create(formData);
        toastSuccess('Traffic route created successfully!');
        router.push('/traffics');
    } catch (err: any) {
        toastError('Creation failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
