<template>
    <div class="w-full max-w-md">
        <div class="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-lg">
            <div class="text-center">
                <h2 class="text-3xl font-bold tracking-tight text-white">Forgot Password</h2>
                <p class="mt-2 text-sm text-gray-300">Enter your email and we'll send you a link to reset your password.</p>
            </div>
            <div v-if="successMessage" class="mt-8 rounded-md bg-green-500/20 p-4 text-center">
                <p class="text-sm text-green-300">{{ successMessage }}</p>
                <NuxtLink to="/login" class="mt-4 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">Back to Sign In</NuxtLink>
            </div>
            <form v-else class="mt-8 space-y-6" @submit.prevent="handleRequestReset">
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

                <div>
                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm transition-all hover:from-blue-500 hover:to-purple-500 disabled:opacity-50"
                    >
                        <span v-if="!isLoading">Send Reset Link</span>
                        <span v-else>Sending...</span>
                    </button>
                </div>
                 <div class="text-center">
                    <NuxtLink to="/login" class="text-sm font-medium text-blue-400 hover:text-blue-300">Back to Sign In</NuxtLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';

definePageMeta({ layout: 'auth', middleware: ['guest'] });
useHead({ title: 'Forgot Password' });

const { $api } = useNuxtApp();
const email = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

async function handleRequestReset() {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await $api.auth.requestPasswordReset(email.value);
        successMessage.value = response.message;
    } catch (e: any) {
        error.value = e.data?.message || 'An error occurred.';
    } finally {
        isLoading.value = false;
    }
}
</script>
