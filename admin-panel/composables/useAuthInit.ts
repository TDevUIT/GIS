import { useState } from '#app';
export const useAuthInit = () => {
    const p = useState<Promise<void> | null>('auth-init-promise', () => null);

    const setAuthInitPromise = (promise: Promise<void>) => {
        p.value = promise;
    };

    return {
        authInitPromise: p,
        setAuthInitPromise,
    };
};
