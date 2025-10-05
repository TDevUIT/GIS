export interface Demographic {
  id: string;
  ageGroup: string;
  male: number;
  female: number;
  populationId: string;
}

export interface Household {
  id: string;
  householdSize: number;
  incomeLevel: string | null;
  housingType: string | null;
  populationId: string;
}

export interface Population {
  id: string;
  year: number;
  populationTotal: number;
  householdsTotal: number;
  createdAt: string;
  updatedAt: string;
  districtId: string;
  district?: {
    name: string;
  };
  households?: Household[];
  demographics?: Demographic[];
}

type CreateHouseholdDTO = Omit<Household, 'id' | 'populationId'>;
type CreateDemographicDTO = Omit<Demographic, 'id' | 'populationId'>;

export type CreatePopulationDTO = Omit<
  Population,
  'id' | 'createdAt' | 'updatedAt' | 'district' | 'households' | 'demographics'
> & {
  households?: CreateHouseholdDTO[];
  demographics?: CreateDemographicDTO[];
};

export type UpdatePopulationDTO = Partial<
  Omit<CreatePopulationDTO, 'households' | 'demographics'>
>;

export interface FindPopulationsQuery {
  districtId?: string;
  year?: number;
}
