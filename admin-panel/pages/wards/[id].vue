<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/wards" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Wards
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Ward</h1>
            <p v-if="ward" class="mt-1 text-sm text-gray-400">Update the details for "{{ ward.data.data.name }}".</p>
        </header>
        <div v-if="pending" class="text-center py-10">Loading ward data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data: {{ error.message }}</div>
        <div v-else-if="ward && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesWardsWardForm
                :initial-data="ward.data.data"
                :districts="districts"
                :is-submitting="isSubmitting"
                @submit="handleSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { UpdateWardDTO } from '~/types/api/ward';

const route = useRoute();
const wardId = route.params.id as string;

useHead({ title: `Edit Ward` });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const { data: pageData, pending, error } = await useAsyncData(`ward-edit-${wardId}`, async () => {
    const [wardRes, districtsRes] = await Promise.all([
        $api.wards.getById(wardId),
        $api.districts.getAll()
    ]);
    return {
        ward: wardRes,
        districts: districtsRes.data.data
    };
});

const ward = computed(() => pageData.value?.ward);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdateWardDTO) {
    isSubmitting.value = true;
    try {
        const payload: UpdateWardDTO = {
            name: formData.name,
            code: formData.code,
            geom: formData.geom,
            districtId: formData.districtId,
        };
        await $api.wards.update(wardId, payload);
        toastSuccess('Ward updated successfully!');
        router.push('/wards');
    } catch (err: any) {
        const message = Array.isArray(err.data?.message) ? err.data.message.join(', ') : err.data?.message;
        toastError('Update failed', message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
