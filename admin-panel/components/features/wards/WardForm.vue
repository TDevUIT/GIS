<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="district" class="block text-sm font-medium leading-6 text-gray-300">District</label>
            <div class="mt-2">
                <select
                    v-model="form.districtId"
                    id="district"
                    required
                    class="form-input"
                >
                    <option disabled value="">Please select a district</option>
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                        {{ district.name }}
                    </option>
                </select>
            </div>
        </div>
        <div>
            <label for="name" class="block text-sm font-medium leading-6 text-gray-300">Ward Name</label>
            <div class="mt-2">
                <input v-model="form.name" type="text" id="name" required class="form-input" />
            </div>
        </div>
        <div>
            <label for="code" class="block text-sm font-medium leading-6 text-gray-300">Ward Code</label>
            <div class="mt-2">
                <input v-model="form.code" type="text" id="code" required class="form-input" />
            </div>
        </div>
        <div>
            <label for="geom" class="block text-sm font-medium leading-6 text-gray-300">Geometry (WKT)</label>
            <div class="mt-2">
                <textarea v-model="form.geom" id="geom" rows="5" required class="form-input" placeholder="POLYGON((...))"></textarea>
            </div>
            <p class="mt-2 text-xs text-gray-400">Use a tool like geojson.io to create WKT strings.</p>
        </div>
        <div class="flex items-center justify-end gap-x-6 pt-4">
            <NuxtLink to="/wards" class="text-sm font-semibold leading-6 text-gray-300">Cancel</NuxtLink>
            <button type="submit" :disabled="isSubmitting" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50">
                {{ isSubmitting ? 'Saving...' : 'Save Ward' }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { CreateWardDTO } from '~/types/api/ward';
import type { District } from '~/types/api/district';

const props = defineProps<{
    initialData?: Partial<CreateWardDTO>;
    districts: District[];
    isSubmitting: boolean;
}>();

const emit = defineEmits(['submit']);

const form = ref<Partial<CreateWardDTO>>({
    name: '',
    code: '',
    geom: '',
    districtId: '',
    ...props.initialData,
});

function handleSubmit() {
    emit('submit', form.value);
}
</script>

<style scoped>
.form-input {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
.form-select option {
    background-color: #1f2937;
    color: white;
}
</style>
