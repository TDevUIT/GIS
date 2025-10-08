<template>
    <aside 
        class="flex flex-shrink-0 flex-col border-r border-gray-700/50 bg-gray-900 transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'w-20' : 'w-64'"
    >
        <div class="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-700/50 px-4">
            <NuxtLink 
                to="/" 
                class="flex items-center gap-3 overflow-hidden transition-opacity duration-200"
                :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
            >
                <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1759739740/EG_sj9np4.jpg" alt="EGis Logo" class="h-10 w-10 flex-shrink-0 rounded-md" />
                <span class="text-xl font-bold text-white whitespace-nowrap">EGis Admin</span>
            </NuxtLink>
            <button @click="isCollapsed = !isCollapsed" class="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white">
                <ChevronDoubleLeftIcon class="h-6 w-6 transition-transform duration-300" :class="{ 'rotate-180': isCollapsed }" />
            </button>
        </div>
        <nav class="flex-1 overflow-y-auto overflow-x-hidden p-2">
            <ul class="flex flex-col gap-1">
                <li v-for="item in filteredNavigation" :key="item.name">
                    <NuxtLink
                        :to="item.href"
                        class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                        active-class="!bg-blue-600 !text-white"
                    >
                        <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                        <span 
                            class="whitespace-nowrap transition-all duration-200"
                            :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
                        >
                            {{ item.name }}
                        </span>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { ChevronDoubleLeftIcon } from '@heroicons/vue/24/solid';
import { navigation, type NavigationItem } from '~/configs/navigation';
import { useAuth } from '~/composables/useAuth';

const { isAdmin } = useAuth();
const isCollapsed = ref(false);

const filteredNavigation = computed<NavigationItem[]>(() => {
    if (isAdmin.value) {
        return navigation;
    }
    return navigation.filter(item => !item.adminOnly);
});
</script>
