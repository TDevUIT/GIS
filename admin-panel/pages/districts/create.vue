<template>
  <div class="max-w-4xl mx-auto">
    <header class="mb-8">
      <NuxtLink to="/districts" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
        <ArrowLeftIcon class="h-4 w-4" />
        Back to Districts
      </NuxtLink>
      <h1 class="text-2xl font-bold text-white">Add New District</h1>
      <p class="mt-1 text-sm text-gray-400">Fill in the details to create a new district record.</p>
    </header>

    <div class="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
      <FeaturesDistrictsDistrictForm :is-submitting="isSubmitting" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import type { CreateDistrictDTO } from '~/types/api/district';

useHead({ title: 'Add District' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();
const isSubmitting = ref(false);

async function handleSubmit(formData: CreateDistrictDTO) {
  isSubmitting.value = true;
  try {
    await $api.districts.create(formData);
    toastSuccess('District created successfully!');
    router.push('/districts');
  } catch (err: any) {
    toastError('Creation failed', err.data?.message || 'An error occurred.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
