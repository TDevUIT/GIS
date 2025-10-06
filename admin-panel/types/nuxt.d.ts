import type { ApiInstance } from '../repositories/factory';

declare global {
    function definePageMeta(meta: Record<string, any>): void;
}

declare module '#app' {
    interface NuxtApp {
        $api: ApiInstance;
    }
}

declare module 'nuxt/app' {
    interface NuxtApp {
        $api: ApiInstance;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: ApiInstance;
    }
}

export {};
