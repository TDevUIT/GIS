<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex items-center gap-4 mb-6">
            <NuxtLink to="/users" class="p-2 rounded-full text-gray-300 hover:bg-gray-700/50 transition-colors" title="Back to Users">
                <ArrowLeftIcon class="h-6 w-6" />
            </NuxtLink>
            <div>
                <h1 class="text-2xl font-bold text-white">Add New Supervisor</h1>
                <p class="mt-1 text-sm text-gray-400">An email with a temporary password will be sent to the user.</p>
            </div>
        </header>

        <div class="flex-grow flex items-center justify-center">
            <div class="w-full max-w-md">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-lg">
                    <form class="space-y-6" @submit.prevent="handleSubmit">
                        <div class="relative">
                            <input v-model="form.name" id="name" type="text" required class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Full Name" />
                            <label for="name" class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs">Full Name</label>
                            <UserIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div class="relative">
                            <input v-model="form.email" id="email" type="email" required class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Email Address" />
                            <label for="email" class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs">Email Address</label>
                            <EnvelopeIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div class="relative">
                            <input v-model="form.phone" id="phone" type="tel" required class="peer h-12 w-full rounded-md border border-gray-600 bg-gray-900/50 px-4 pl-12 text-white placeholder-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Phone Number" />
                            <label for="phone" class="absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 transition-all duration-300 peer-focus:opacity-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-xs">Phone Number</label>
                            <PhoneIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div>
                            <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-500 hover:to-purple-500 disabled:opacity-50">
                                <span v-if="!isLoading">Create Account</span>
                                <span v-else>Creating...</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp, useHead } from '#app';
import { ArrowLeftIcon, UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/vue/24/outline';
import type { CreateSupervisorDTO } from '~/types/api/auth';

useHead({ title: 'Add Supervisor' });

const { $api } = useNuxtApp();
const router = useRouter();
const { toastSuccess, toastError } = useSwal();

const isLoading = ref(false);

const form = reactive<CreateSupervisorDTO>({
    name: '',
    email: '',
    phone: '',
});

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone: string) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
};

async function handleSubmit() {
    if (!form.name.trim()) {
        toastError('Invalid Input', 'Full Name is required.');
        return;
    }
    if (!isValidEmail(form.email)) {
        toastError('Invalid Input', 'Please enter a valid email address.');
        return;
    }
    if (!form.phone) {
        toastError('Invalid Input', 'Phone number is required.');
        return;
    }
    if (!isValidPhone(form.phone)) {
        toastError('Invalid Input', 'Please enter a valid Vietnamese phone number.');
        return;
    }

    isLoading.value = true;
    try {
        await $api.users.createSupervisor({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
        });
        toastSuccess('Success!', 'Supervisor account created and an email has been sent.');
        await router.push('/users');
    } catch (e: any) {
        const message = e.data?.message || 'An unexpected error occurred.';
        let friendlyMessage = Array.isArray(message) ? message.join(', ') : message;

        if (friendlyMessage.toLowerCase().includes('email')) {
            friendlyMessage = 'This email address is already in use by another account.';
        } else if (friendlyMessage.toLowerCase().includes('phone')) {
            friendlyMessage = 'This phone number is already in use by another account.';
        }

        toastError('Creation Failed', friendlyMessage);
    } finally {
        isLoading.value = false;
    }
}
</script>
