<template>
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <NuxtLink
                to="/infrastructures"
                class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
            >
                <ArrowLeftIcon class="h-4 w-4" />
                Back to Infrastructures
            </NuxtLink>
            <h1 class="text-2xl font-bold text-white">Edit Infrastructure</h1>
            <p v-if="infra" class="mt-1 text-sm text-gray-400">
                Update the details for "{{ infra.name }}".
            </p>
        </header>
        <div v-if="pending" class="text-center py-10">Loading data...</div>
        <div v-else-if="error" class="text-red-400">
            Failed to load data: {{ error.message }}
        </div>
        <div
            v-else-if="infra && districts"
            class="rounded-lg border border-gray-700 bg-gray-800/50 p-6"
        >
            <FeaturesInfrastructuresInfrastructureForm
                :initial-data="infra"
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
import type { UpdateInfrastructureDTO } from '~/types/api/infrastructure';

const route = useRoute();
const infraId = route.params.id as string;

useHead({ title: `Edit Infrastructure` });
definePageMeta({ layout: 'default' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

const { data: pageData, pending, error } = await useAsyncData(
    `infra-edit-${infraId}`,
    async () => {
        const infraRes = await $api.infrastructures.getById(infraId);
        const districtsRes = await $api.districts.getAll();
        return {
            infra: infraRes.data.data,
            districts: districtsRes.data.data,
        };
    }
);

const infra = computed(() => pageData.value?.infra);
const districts = computed(() => pageData.value?.districts);

async function handleSubmit(formData: UpdateInfrastructureDTO) {
    isSubmitting.value = true;
    try {
        await $api.infrastructures.update(infraId, formData);
        toastSuccess('Infrastructure updated successfully!');
        router.push('/infrastructures');
    } catch (err: any) {
        const message = Array.isArray(err.data?.message)
            ? err.data.message.join(', ')
            : err.data?.message;
        toastError('Update failed', message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>
