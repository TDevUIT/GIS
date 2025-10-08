<template>
    <div class="flex h-screen bg-gray-900 text-gray-100 font-sans">
        <AppSidebar />
        <div class="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main class="flex-1 overflow-y-auto bg-gray-800 p-6 md:p-8">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
