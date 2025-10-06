import { ofetch } from 'ofetch';

import authRepository from './auth';
import usersRepository from './users';
import districtsRepository from './districts';
import wardsRepository from './wards';
import landUsesRepository from './land-uses';
import terrainsRepository from './terrains';
import urbanPlansRepository from './urban-plans';
import publicTransportsRepository from './public-transports';
import airQualitiesRepository from './air-qualities';
import waterQualitiesRepository from './water-qualities';
import trafficsRepository from './traffics';
import accidentsRepository from './accidents';
import populationsRepository from './populations';
import infrastructuresRepository from './infrastructures';
import analyticsRepository from './analytics';

type OFetch = typeof ofetch;
export interface ApiInstance {
    auth: ReturnType<typeof authRepository>;
    users: ReturnType<typeof usersRepository>;
    districts: ReturnType<typeof districtsRepository>;
    wards: ReturnType<typeof wardsRepository>;
    landUses: ReturnType<typeof landUsesRepository>;
    terrains: ReturnType<typeof terrainsRepository>;
    urbanPlans: ReturnType<typeof urbanPlansRepository>;
    publicTransports: ReturnType<typeof publicTransportsRepository>;
    airQualities: ReturnType<typeof airQualitiesRepository>;
    waterQualities: ReturnType<typeof waterQualitiesRepository>;
    traffics: ReturnType<typeof trafficsRepository>;
    accidents: ReturnType<typeof accidentsRepository>;
    populations: ReturnType<typeof populationsRepository>;
    infrastructures: ReturnType<typeof infrastructuresRepository>;
    analytics: ReturnType<typeof analyticsRepository>;
}

export const apiFactory = (apiFetch: OFetch): ApiInstance => ({
    auth: authRepository(apiFetch),
    users: usersRepository(apiFetch),
    districts: districtsRepository(apiFetch),
    wards: wardsRepository(apiFetch),
    landUses: landUsesRepository(apiFetch),
    terrains: terrainsRepository(apiFetch),
    urbanPlans: urbanPlansRepository(apiFetch),
    publicTransports: publicTransportsRepository(apiFetch),
    airQualities: airQualitiesRepository(apiFetch),
    waterQualities: waterQualitiesRepository(apiFetch),
    traffics: trafficsRepository(apiFetch),
    accidents: accidentsRepository(apiFetch),
    populations: populationsRepository(apiFetch),
    infrastructures: infrastructuresRepository(apiFetch),
    analytics: analyticsRepository(apiFetch),
});
