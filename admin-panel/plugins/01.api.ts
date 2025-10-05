import { ofetch } from 'ofetch';
import districtsRepository from '../repositories/districts';
import wardsRepository from '../repositories/wards';
import landUses from '../repositories/land-uses';
import terrains from '../repositories/terrains';
import urbanPlans from '../repositories/urban-plans';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.public.apiBaseUrl as string | undefined;

    const apiFetch = ofetch.create({
        baseURL: apiBaseUrl,
        onRequest({ options }) {},
        onResponseError({ response }) {
            console.error('API Error:', response._data);
        },
    });

    const repositories = {
        districts: districtsRepository(apiFetch),
        wards: wardsRepository(apiFetch),
        landUses: landUses(apiFetch),
        terrains: terrains(apiFetch),
        urbanPlans: urbanPlans(apiFetch),
    };

    return {
        provide: {
            api: repositories,
        },
    };
});
