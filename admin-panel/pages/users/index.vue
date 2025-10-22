<template>
    <div class="h-full flex flex-col">
        <header class="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-bold text-white">User Management</h1>
                <p class="mt-1 text-sm text-gray-400">Manage supervisor accounts.</p>
            </div>
            <button
                @click="router.push('/users/create')"
                class="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
                <PlusIcon class="h-5 w-5" />
                <span>Add Supervisor</span>
            </button>
        </header>

        <div class="flex-grow bg-gray-800/50 p-4 rounded-lg overflow-y-auto">
            <UiDataTable :columns="columns" :data="users || []" :is-loading="pending">
                <template #cell-isActive="{ value }">
                     <span 
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="value ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'"
                    >
                        {{ value ? 'Active' : 'Inactive' }}
                    </span>
                </template>
                 <template #cell-createdAt="{ value }">
                    {{ new Date(value).toLocaleDateString('en-GB') }}
                </template>
                <template #actions="{ item }">
                    <div class="flex items-center justify-end gap-4">
                         <button 
                            v-if="item.isActive"
                            @click="handleToggleActivation(item.id, item.name, false)" 
                            class="text-yellow-400 hover:text-yellow-300" 
                            title="Deactivate"
                        >
                            <UserMinusIcon class="h-5 w-5" />
                        </button>
                         <button 
                            v-else
                            @click="handleToggleActivation(item.id, item.name, true)" 
                            class="text-green-400 hover:text-green-300" 
                            title="Activate"
                        >
                            <UserPlusIcon class="h-5 w-5" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PlusIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/vue/24/outline';
import type { User } from '~/types/api/auth';
import type { DataTableColumn } from '~/components/ui/DataTable.vue';

useHead({ title: 'User Management' });

const router = useRouter();
const { $api } = useNuxtApp();
const { confirm, toastSuccess, toastError } = useSwal();

const columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'isActive', label: 'Status' },
    { key: 'createdAt', label: 'Created At' },
];

const { data: users, pending, refresh: refreshUsers } = useAsyncData('users-list', async () => {
    try {
        return await $api.users.getAll();
    } catch (error) {
        toastError('Fetch Failed', 'Could not load the list of users.');
        return [];
    }
}, { default: () => [] });

async function handleToggleActivation(id: string, name: string, activate: boolean) {
    const action = activate ? 'activate' : 'deactivate';
    const result = await confirm({
        title: `Confirm ${action}`,
        text: `Are you sure you want to ${action} the account for "${name}"?`,
        confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
        try {
            const apiCall = activate ? $api.users.activate(id) : $api.users.deactivate(id);
            await apiCall;
            toastSuccess(`User ${name} has been ${action}d.`);
            await refreshUsers();
        } catch (err: any) {
            toastError('Operation Failed', err.data?.message || 'An error occurred.');
        }
    }
}
</script>
