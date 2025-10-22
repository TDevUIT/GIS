<template>
    <div
        class="flex h-screen text-gray-100 font-sans"
        :style="{
            backgroundImage: 'url(https://res.cloudinary.com/dbonwxmgl/image/upload/v1761124311/gg_jefzr4.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }"
    >
        <AppSidebar />

        <div class="flex flex-1 flex-col overflow-hidden">
            <AppHeader />

            <main class="flex-1 overflow-y-auto bg-gray-800/5 backdrop-blur-sm p-6 md:p-8">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
