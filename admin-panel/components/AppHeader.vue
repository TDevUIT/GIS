<template>
    <header class="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-700/50 bg-gray-900/40 backdrop-blur-sm px-6">
        <h1 class="text-xl font-semibold capitalize text-white">
            {{ pageTitle }}
        </h1>
        <div ref="menuRef" class="relative">
            <button @click="isMenuOpen = !isMenuOpen" class="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-gray-700/50">
                <span class="hidden text-sm font-medium text-gray-300 md:block">{{ user?.name || 'User' }}</span>
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-gray-600">
                    {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
            </button>
            <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800/80 backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                        <div class="border-b border-gray-700 px-4 py-2">
                            <p class="text-sm font-medium text-white">{{ user?.name }}</p>
                            <p class="text-xs text-gray-400">{{ user?.email }}</p>
                        </div>
                        <button @click="handleLogout" class="group flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300">
                            <ArrowRightOnRectangleIcon class="h-5 w-5" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { onClickOutside } from '@vueuse/core';
import { navigation } from '~/configs/navigation';

const route = useRoute();
const { user, logout } = useAuth();

const menuRef = ref(null);
const isMenuOpen = ref(false);

onClickOutside(menuRef, () => {
    isMenuOpen.value = false;
});

const pageTitle = computed(() => {
    const currentRoute = navigation.find(item => item.href === route.path);
    return currentRoute?.name || route.path.substring(1) || 'Dashboard';
});

async function handleLogout() {
    isMenuOpen.value = false;
    await logout();
}
</script>
