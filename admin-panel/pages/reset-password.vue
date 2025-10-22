<template>
    <div class="w-full max-w-md">
        <div class="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-lg">
            <div class="text-center">
                <h2 class="text-3xl font-bold tracking-tight text-white">Reset Your Password</h2>
                <p class="mt-2 text-sm text-gray-300">Enter a new secure password for your account.</p>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
                <div v-if="error" class="rounded-md bg-red-500/20 p-3 text-center text-sm text-red-300">
                    {{ error }}
                </div>

                <div class="relative">
                    <input
                        v-model="newPassword"
                        id="newPassword"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        required
                        class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="New Password"
                    />
                    <label
                        for="newPassword"
                        class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                        New Password
                    </label>
                    <LockClosedIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <button type="button" @click="isPasswordVisible = !isPasswordVisible" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <EyeSlashIcon v-if="isPasswordVisible" class="h-5 w-5" />
                        <EyeIcon v-else class="h-5 w-5" />
                    </button>
                </div>

                <div class="relative">
                    <input
                        v-model="confirmPassword"
                        id="confirmPassword"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        required
                        class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Confirm Password"
                    />
                    <label
                        for="confirmPassword"
                        class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                        Confirm Password
                    </label>
                    <LockClosedIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-500 hover:to-purple-500 disabled:opacity-50"
                    >
                        <span v-if="!isLoading">Reset Password</span>
                        <span v-else>Resetting...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

definePageMeta({
    layout: 'auth',
    middleware: ['guest']
});
useHead({ title: 'Reset Password' });

const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();

const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const isPasswordVisible = ref(false);
const token = ref<string | null>(null);

onMounted(() => {
    const tokenFromQuery = route.query.token as string;
    if (!tokenFromQuery) {
        toastError('Invalid Link', 'The password reset link is invalid or has expired.');
        router.push('/login');
    }
    token.value = tokenFromQuery;
});

async function handleResetPassword() {
    error.value = null;

    if (newPassword.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        return;
    }
    if (newPassword.value.length < 8) {
        error.value = 'Password must be at least 8 characters long.';
        return;
    }
    if (!token.value) {
        error.value = 'Reset token is missing. Please use the link from your email again.';
        return;
    }

    isLoading.value = true;
    try {
        await $api.auth.resetPassword(token.value, { newPassword: newPassword.value });
        toastSuccess('Success!', 'Your password has been reset. You can now log in.');
        await router.push('/login');
    } catch (e: any) {
        const message = e.data?.message || 'An unexpected error occurred. The link may have expired.';
        error.value = Array.isArray(message) ? message.join(', ') : message;
        toastError('Failed', error.value ?? undefined);
    } finally {
        isLoading.value = false;
    }
}
</script>
