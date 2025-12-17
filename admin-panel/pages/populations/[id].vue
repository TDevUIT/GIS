<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/populations" class="back-link">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Populations
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Population Data</h1>
            <p v-if="!pending && population" class="mt-1 text-sm text-gray-400">
                Updating data for "{{ population.district.name }}" in {{ population.year }}.
            </p>
        </header>
        <div v-if="pending" class="text-center py-10 text-gray-400">
            <svg class="animate-spin mx-auto h-8 w-8 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading data...
        </div>
        <div v-else-if="error" class="text-red-400 bg-red-900/50 p-4 rounded-md">
            Failed to load data: {{ error.message }}
        </div>
        <div v-else-if="population && districts">
            <FeaturesPopulationsPopulationForm
                :initial-data="population"
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
        <div v-else class="text-center py-10 text-gray-500">
            Could not find population data to edit.
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { UpdatePopulationDTO } from '~/types/api/population';

const route = useRoute();
const populationId = route.params.id as string;
useHead({ title: 'Edit Population Data' });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: pageData, pending, error } = await useAsyncData(`population-edit-${populationId}`, async () => {
    const [popRes, districtsRes] = await Promise.all([
        $api.populations.getById(populationId),
        $api.districts.getAll()
    ]);
    return {
        population: extractData(popRes),
        districts: extractData(districtsRes)
    };
});

const population = computed(() => pageData.value?.population);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdatePopulationDTO) {
    isSubmitting.value = true;
    try {
        await $api.populations.update(populationId, formData);
        toastSuccess('Population data updated successfully!');
        router.push('/populations');
    } catch (err: any) {
        const message = Array.isArray(err.data?.message) ? err.data.message.join(', ') : err.data?.message;
        toastError('Update failed', message || 'An error occurred.');
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
