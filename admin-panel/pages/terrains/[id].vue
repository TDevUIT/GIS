<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink to="/terrains" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Terrain Analysis
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Terrain Area</h1>
             <p v-if="terrainData" class="mt-1 text-sm text-gray-400">Updating terrain data in {{ terrainData.districtName }}.</p>
        </header>
        <div v-if="pending" class="text-center py-10 text-gray-400">Loading data...</div>
        <div v-else-if="error" class="text-red-400">Failed to load data.</div>
        <div v-else-if="terrainData && districts" class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <FeaturesTerrainsTerrainForm
                :initial-data="terrainData"
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
import type { UpdateTerrainDTO } from '~/types/api/terrain';

const route = useRoute();
const terrainId = route.params.id as string;
useHead({ title: 'Edit Terrain Area' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const { data: pageData, pending, error } = await useAsyncData(`terrain-edit-${terrainId}`, async () => {
    const [terrainRes, districtsRes] = await Promise.all([
        $api.terrains.getById(terrainId),
        $api.districts.getAll()
    ]);
    const data = extractData(terrainRes);
    if (data && typeof data.geom === 'string') {
        data.geom = JSON.parse(data.geom);
    }
    return { terrainData: data, districts: extractData(districtsRes) };
});

const terrainData = computed(() => pageData.value?.terrainData);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdateTerrainDTO) {
    isSubmitting.value = true;
    try {
        await $api.terrains.update(terrainId, formData);
        toastSuccess('Terrain updated successfully!');
        router.push('/terrains');
    } catch (err: any) {
        toastError('Update failed', err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
