<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/urban-plans" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Urban Plans
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Urban Plan</h1>
            <p v-if="urbanPlan" class="mt-1 text-sm text-gray-400">Update the details for "{{ urbanPlan.planName }}".</p>
        </header>
        <div v-if="pending" class="text-center py-10">Loading data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data.</div>
        <div v-else-if="urbanPlan && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesUrbanPlansUrbanPlanForm
                :initial-data="urbanPlan"
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
import type { UpdateUrbanPlanDTO } from '~/types/api/urban-plan';

const route = useRoute();
const planId = route.params.id as string;

useHead({ title: 'Edit Urban Plan' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: pageData, pending, error } = await useAsyncData(`urbanplan-edit-${planId}`, async () => {
    const [planRes, districtsRes] = await Promise.all([
        $api.urbanPlans.getById(planId),
        $api.districts.getAll()
    ]);
    return {
        urbanPlan: extractData(planRes),
        districts: extractData(districtsRes)
    };
});

const urbanPlan = computed(() => pageData.value?.urbanPlan);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdateUrbanPlanDTO) {
    isSubmitting.value = true;
    try {
        await $api.urbanPlans.update(planId, formData);
        toastSuccess('Urban Plan updated successfully!');
        router.push('/urban-plans');
    } catch (err: any) {
        toastError('Update failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
