<template>
    <div
        class="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    >
        <div class="absolute inset-0 bg-black/30" />
        <header class="absolute left-8 top-8 z-20">
            <a href="/">
                <img :src="logoUrl" alt="EGis Logo" class="h-10 w-auto rounded-md shadow-lg" />
            </a>
        </header>
        <main class="relative z-10 flex min-h-screen items-center justify-center">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const backgroundImageUrl = 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1759739767/ka_fcs8ct.jpg';
const logoUrl = 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1759739740/EG_sj9np4.jpg';
</script>
