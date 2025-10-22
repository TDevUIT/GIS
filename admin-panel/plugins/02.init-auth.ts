import { useAuth } from "~/composables/useAuth";
import { useAuthInit } from "~/composables/useAuthInit";

export default defineNuxtPlugin(async (nuxtApp) => {
    const { fetchUser } = useAuth();
    const { setAuthInitPromise } = useAuthInit();

    if (process.client) {
        const promise = fetchUser().then(() => {});
        setAuthInitPromise(promise);
    }
});
