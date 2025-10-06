<template>
    <div class="w-full max-w-md">
        <div class="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-lg">
            <div class="text-center">
                <h2 class="text-3xl font-bold tracking-tight text-white">Sign In</h2>
                <p class="mt-2 text-sm text-gray-300">Welcome back to EGis Admin Panel</p>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div v-if="error" class="rounded-md bg-red-500/20 p-3 text-center text-sm text-red-300">
                    {{ error }}
                </div>
                <div class="relative">
                    <input
                        v-model="email"
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Email address"
                    />
                    <label for="email" class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs">
                        Email address
                    </label>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                </div>
                <div class="relative">
                    <input
                        v-model="password"
                        id="password"
                        name="password"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        autocomplete="current-password"
                        required
                        class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Password"
                    />
                    <label for="password" class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs">
                        Password
                    </label>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <button type="button" @click="isPasswordVisible = !isPasswordVisible" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <svg v-if="isPasswordVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </button>
                </div>
                <div class="text-right">
                    <a href="#" class="text-sm font-medium text-blue-400 hover:text-blue-300">Forgot password?</a>
                </div>
                <div>
                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm transition-all hover:from-blue-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
                    >
                        <span v-if="!isLoading">Sign In</span>
                        <span v-else>Signing In...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

definePageMeta({
    layout: 'auth',
});

const { $api } = useNuxtApp();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const isPasswordVisible = ref(false);

async function handleLogin() {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await $api.auth.login({
            email: email.value,
            password: password.value,
        });
        if (response.mustChangePassword) {
            error.value = 'First login: Please set a new password.'; 
            return; 
        }
        const user = await $api.auth.getProfile();
        authStore.setUser(user);
        const redirectPath = route.query.redirect as string | undefined;
        await router.push(redirectPath || '/');
    } catch (e: any) {
        error.value = e.data?.message || 'An unexpected error occurred.';
    } finally {
        isLoading.value = false;
    }
}
</script>
