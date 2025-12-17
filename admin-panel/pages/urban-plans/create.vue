<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/urban-plans" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Urban Plans
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Add New Urban Plan</h1>
            <p class="mt-1 text-sm text-gray-400">Fill in the details for the new urban plan.</p>
        </header>
        <div v-if="districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesUrbanPlansUrbanPlanForm
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
        <div v-else class="text-center py-10">Loading form...</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { CreateUrbanPlanDTO } from '~/types/api/urban-plan';

useHead({ title: 'Add Urban Plan' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: districts } = useAsyncData('districts-for-form', async () => {
    const response = await $api.districts.getAll();
    return extractData(response);
});

async function handleSubmit(formData: CreateUrbanPlanDTO) {
    isSubmitting.value = true;
    try {
        await $api.urbanPlans.create(formData);
        toastSuccess('Urban Plan created successfully!');
        router.push('/urban-plans');
    } catch (err: any) {
        toastError('Creation failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
