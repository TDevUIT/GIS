<template>
    <div class="border-t border-gray-700 pt-6 mt-6">
        <h3 class="text-lg font-medium text-white mb-4">Manage Images</h3>

        <div v-if="currentImages.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            <div v-for="image in currentImages" :key="image.id" class="relative group">
                <img :src="image.url" alt="Infrastructure Image" class="aspect-square w-full rounded-md object-cover" />
                <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="handleDeleteImage(image.id, image.publicId)" type="button" class="p-2 rounded-full bg-red-600/80 hover:bg-red-500 text-white" title="Delete Image">
                        <TrashIcon class="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 py-4 border-2 border-dashed border-gray-600 rounded-lg mb-6">
            No images uploaded yet.
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Upload New Images</label>
            <p class="text-xs text-gray-400 mb-2">
                <span class="font-semibold text-yellow-400">Note:</span> Uploading new images will <span class="underline">replace all</span> current ones.
            </p>
            <input
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div v-if="previews.length" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="(preview, index) in previews" :key="index" class="relative">
                    <img :src="preview" class="aspect-square w-full rounded-md object-cover" />
                </div>
            </div>

            <div class="mt-4 flex justify-end">
                <button
                    type="button"
                    @click="handleUploadAndSet"
                    :disabled="!selectedFiles.length || isUploading"
                    class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    <ArrowUpTrayIcon class="h-5 w-5 mr-2" />
                    <span v-if="isUploading">Uploading...</span>
                    <span v-else>Upload & Set Images</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { TrashIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline';
import type { Image } from '~/types/api/accident';

const props = defineProps<{
    infraId: string;
    initialImages: Image[];
}>();

const emit = defineEmits(['images-updated']);

const { $api } = useNuxtApp();
const { toastSuccess, toastError, confirmDelete } = useSwal();

const extractData = (response: any) => response?.data?.data?.data || response?.data?.data || response?.data || response || [];

const currentImages = ref<Image[]>([]);
const selectedFiles = ref<File[]>([]);
const previews = ref<string[]>([]);
const isUploading = ref(false);

watch(
    () => props.initialImages,
    (newImages) => {
        currentImages.value = [...newImages];
    },
    { immediate: true, deep: true }
);

function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        selectedFiles.value = Array.from(target.files);
        generatePreviews();
    }
}

function generatePreviews() {
    previews.value = [];
    if (selectedFiles.value.length === 0) return;
    for (const file of selectedFiles.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                previews.value.push(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
}

async function handleUploadAndSet() {
    if (selectedFiles.value.length === 0) return;

    isUploading.value = true;
    try {
        const uploadedImagesResponse = await $api.infrastructures.uploadImages(selectedFiles.value);
        const uploadedImages = extractData(uploadedImagesResponse);

        const setImagesBody = { images: uploadedImages };
        await $api.infrastructures.setImages(props.infraId, setImagesBody);

        toastSuccess('Images updated successfully!');
        selectedFiles.value = [];
        previews.value = [];
        emit('images-updated');
    } catch (err: any) {
        toastError('Upload Failed', err.data?.message || 'An error occurred.');
    } finally {
        isUploading.value = false;
    }
}

async function handleDeleteImage(imageId: string, publicId: string) {
    const result = await confirmDelete(`this image (${publicId})`);
    if (result.isConfirmed) {
        try {
            await $api.infrastructures.deleteImage(props.infraId, imageId);
            toastSuccess('Image deleted successfully!');
            emit('images-updated');
        } catch (err: any) {
            toastError('Deletion Failed', err.data?.message || 'An error occurred.');
        }
    }
}
</script>
