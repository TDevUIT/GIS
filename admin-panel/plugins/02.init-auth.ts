import { useAuth } from "~/composables/useAuth";
import { useAuthStore } from "~/store/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore();
    const { fetchUser } = useAuth();

    if (process.client && !authStore.isAuthenticated) {
        await fetchUser();
    }
});
