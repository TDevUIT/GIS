<template>
    <div class="absolute bottom-4 right-4 bg-gray-800/80 p-3 rounded-lg border border-gray-600 text-white text-sm shadow-lg backdrop-blur-sm">
        <h4 class="font-bold mb-2 text-base">{{ title }}</h4>
        <ul>
            <li v-for="item in items" :key="item.label" class="flex items-center gap-2 mb-1">
                <div class="w-4 h-4 rounded border border-gray-500" :style="{ backgroundColor: item.color }"></div>
                <span>{{ item.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    items: { color: string; label: string }[];
}>();
</script>
