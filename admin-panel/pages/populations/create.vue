<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/populations" class="back-link">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Populations
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Add New Population Data</h1>
            <p class="mt-1 text-sm text-gray-400">Fill in the details for the new population record.</p>
        </header>
        <div v-if="pending" class="text-center py-10 text-gray-400">Loading form...</div>
        <div v-else-if="error" class="text-red-400">Error loading districts: {{ error.message }}</div>
        <div v-else-if="districts">
            <FeaturesPopulationsPopulationForm
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { CreatePopulationDTO } from '~/types/api/population';

useHead({ title: 'Add Population Data' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: districts, pending, error } = await useAsyncData('districts-for-form', async () => {
    const response = await $api.districts.getAll();
    return extractData(response);
});

async function handleSubmit(formData: CreatePopulationDTO) {
    isSubmitting.value = true;
    try {
        await $api.populations.create(formData);
        toastSuccess('Population data created successfully!');
        router.push('/populations');
    } catch (err: any) {
        const message = Array.isArray(err.data?.message) ? err.data.message.join(', ') : err.data?.message;
        toastError('Creation failed', message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style scoped>
.back-link {
    @apply flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4;
}
</style>
