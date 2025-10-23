<template>
    <div v-if="images && images.length" class="relative w-full select-none">
        <div class="aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
            <img
                :src="images[currentIndex].url"
                :alt="`Image ${currentIndex + 1}`"
                class="w-full h-full object-contain transition-opacity duration-300"
                :key="currentIndex"
            />
        </div>

        <button
            v-if="images.length > 1"
            @click="prev"
            class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition disabled:opacity-30"
        >
            <ChevronLeftIcon class="h-6 w-6" />
        </button>

        <button
            v-if="images.length > 1"
            @click="next"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition disabled:opacity-30"
        >
            <ChevronRightIcon class="h-6 w-6" />
        </button>

        <div v-if="images.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-mono">
            {{ currentIndex + 1 }} / {{ images.length }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import type { Image } from '~/types/api/accident';

const props = defineProps<{
    images: Image[];
}>();

const currentIndex = ref(0);

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = props.images.length - 1;
    }
};

const next = () => {
    if (currentIndex.value < props.images.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
};
</script>
