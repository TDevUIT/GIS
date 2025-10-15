<template>
    <dialog ref="dialogRef" @close="closeDialog" class="bg-transparent backdrop:bg-black/50 p-0">
        <div class="w-[90vw] max-w-2xl rounded-lg bg-gray-800 border border-gray-700 text-white shadow-2xl">
            <form @submit.prevent="handleSubmit">
                <div class="p-6 border-b border-gray-700">
                    <h2 class="text-xl font-bold">{{ isEditing ? 'Edit Accident Record' : 'Add New Accident' }}</h2>
                    <p class="text-sm text-gray-400 mt-1">For route: <span class="font-semibold">{{ trafficName }}</span></p>
                </div>

                <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="accidentDate" class="form-label">Date & Time</label>
                            <input type="datetime-local" id="accidentDate" v-model="formState.accidentDate" required class="form-input">
                        </div>
                        <div>
                            <label for="severity" class="form-label">Severity</label>
                            <select id="severity" v-model="formState.severity" required class="form-select">
                                <option disabled value="">Select severity</option>
                                <option v-for="s in severityOptions" :key="s" :value="s">{{ s }}</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label for="casualties" class="form-label">Casualties</label>
                        <input type="number" id="casualties" v-model.number="formState.casualties" min="0" required class="form-input">
                    </div>
                    <div>
                        <label class="form-label">Images</label>
                        <div class="mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg">
                            <div v-if="existingImages.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                                <div v-for="image in existingImages" :key="image.id" class="relative group">
                                    <img :src="image.url" class="aspect-square w-full rounded-md object-cover">
                                    <button @click="deleteExistingImage(image.id)" type="button" class="absolute top-1 right-1 bg-red-600/80 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XMarkIcon class="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>
                            <div v-if="newImagePreviews.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                                <div v-for="(preview, index) in newImagePreviews" :key="index" class="relative group">
                                    <img :src="preview.url" class="aspect-square w-full rounded-md object-cover">
                                    <button @click="removeNewImage(index)" type="button" class="absolute top-1 right-1 bg-red-600/80 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XMarkIcon class="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>
                            <div class="text-center">
                               <input type="file" @change="handleFileChange" multiple accept="image/*" class="hidden" ref="fileInputRef">
                               <button @click="fileInputRef.click()" type="button" class="text-blue-400 text-sm hover:underline">
                                   <ArrowUpOnSquareIcon class="h-5 w-5 inline-block mr-1"/>
                                   Select images to upload...
                               </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-gray-900/50 flex justify-end gap-4 rounded-b-lg">
                    <button type="button" @click="closeDialog" class="px-4 py-2 text-sm rounded-md border border-gray-600 hover:bg-gray-700">Cancel</button>
                    <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 flex items-center">
                        <ArrowPathIcon v-if="isSubmitting" class="animate-spin h-4 w-4 mr-2"/>
                        {{ isSubmitting ? 'Saving...' : 'Save Accident' }}
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { ArrowUpOnSquareIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { AccidentSeverity, type Accident, type CreateAccidentDTO, type UpdateAccidentDTO, type Image } from '~/types/api/accident';
import { formatISOForInput, parseISOFromInput } from '~/utils/formatters';

const props = defineProps<{
    isOpen: boolean;
    trafficId: string | null;
    trafficName: string | null;
    initialData?: Accident | null;
}>();

const emit = defineEmits(['close', 'saved']);
const { $api } = useNuxtApp();
const { toastError } = useSwal();

const dialogRef = ref<HTMLDialogElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);

const isEditing = computed(() => !!props.initialData);
const severityOptions = Object.values(AccidentSeverity);

const formState = reactive({
    accidentDate: '',
    severity: '' as AccidentSeverity | '',
    casualties: 0
});
const existingImages = ref<Image[]>([]);
const newImageFiles = ref<File[]>([]);
const newImagePreviews = ref<{ file: File, url: string }[]>([]);
const imagesToDelete = ref<string[]>([]);

function resetForm() {
    formState.accidentDate = formatISOForInput(props.initialData?.accidentDate);
    formState.severity = props.initialData?.severity || '';
    formState.casualties = props.initialData?.casualties ?? 0;
    existingImages.value = [...(props.initialData?.images || [])];
    newImageFiles.value = [];
    newImagePreviews.value = [];
    imagesToDelete.value = [];
}

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        resetForm();
        dialogRef.value?.showModal();
    } else {
        dialogRef.value?.close();
    }
});

function closeDialog() {
    emit('close');
}

function handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    for (const file of files) {
        newImageFiles.value.push(file);
        newImagePreviews.value.push({ file, url: URL.createObjectURL(file) });
    }
}

function removeNewImage(index: number) {
    const preview = newImagePreviews.value[index];
    URL.revokeObjectURL(preview.url);
    newImagePreviews.value.splice(index, 1);
    newImageFiles.value.splice(index, 1);
}

function deleteExistingImage(imageId: string) {
    const imageIndex = existingImages.value.findIndex(img => img.id === imageId);
    if (imageIndex > -1) {
        imagesToDelete.value.push(existingImages.value[imageIndex].publicId);
        existingImages.value.splice(imageIndex, 1);
    }
}

async function handleSubmit() {
    if (!props.trafficId) {
        toastError("No traffic route selected.");
        return;
    }
    isSubmitting.value = true;
    try {
        let uploadedImages: { url: string, publicId: string }[] = [];
        if (newImageFiles.value.length > 0) {
            const res = await $api.accidents.uploadImages(newImageFiles.value);
            uploadedImages = res.data.data;
        }

        const finalImages = [
            ...existingImages.value.map(img => ({ url: img.url, publicId: img.publicId })),
            ...uploadedImages
        ];

        if (isEditing.value && props.initialData) {
            const payload: UpdateAccidentDTO = {
                ...formState,
                accidentDate: parseISOFromInput(formState.accidentDate),
                severity: formState.severity as AccidentSeverity,
            };
            const updatedAccident = await $api.accidents.update(props.initialData.id, payload);
            await $api.accidents.setImages(updatedAccident.data.data.id, { images: finalImages });

        } else {
            const payload: CreateAccidentDTO = {
                ...formState,
                accidentDate: parseISOFromInput(formState.accidentDate),
                severity: formState.severity as AccidentSeverity,
                trafficId: props.trafficId,
            };
            const createdAccident = await $api.accidents.create(payload);
            if (finalImages.length > 0) {
                await $api.accidents.setImages(createdAccident.data.data.id, { images: finalImages });
            }
        }
        
        emit('saved');
        closeDialog();
    } catch (err: any) {
        toastError("Save failed", err.data?.message || 'An error occurred.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style scoped>
dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
}
.form-label {
    @apply block text-sm font-medium text-gray-300 mb-1;
}
.form-input, .form-select {
    @apply block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6;
}
</style>
