<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/land-uses" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Land Uses
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Land Use</h1>
            <p v-if="landUse" class="mt-1 text-sm text-gray-400">Update the details for "{{ landUse.type }}" in {{ landUse.districtName }}.</p>
        </header>
        <div v-if="pending" class="text-center py-10">Loading data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data: {{ error.message }}</div>
        <div v-else-if="landUse && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesLandUsesLandUseForm
                :initial-data="landUse"
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
import type { UpdateLandUseDTO } from '~/types/api/land-use';

const route = useRoute();
const landUseId = route.params.id as string;

useHead({ title: `Edit Land Use` });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const { data: pageData, pending, error } = await useAsyncData(`landuse-edit-${landUseId}`, async () => {
    const [landUseRes, districtsRes] = await Promise.all([
        $api.landUses.getById(landUseId),
        $api.districts.getAll()
    ]);
    return {
        landUse: landUseRes.data.data,
        districts: districtsRes.data.data
    };
});

const landUse = computed(() => pageData.value?.landUse);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdateLandUseDTO) {
    isSubmitting.value = true;
    try {
        await $api.landUses.update(landUseId, formData);
        toastSuccess('Land Use updated successfully!');
        router.push('/land-uses');
    } catch (err: any) {
        const message = Array.isArray(err.data?.message) ? err.data.message.join(', ') : err.data?.message;
        toastError('Update failed', message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
