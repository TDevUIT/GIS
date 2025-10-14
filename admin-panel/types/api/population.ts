export enum IncomeLevel {
  Thap = 'Thap',
  TrungBinh = 'TrungBinh',
  Cao = 'Cao',
}

export enum HousingType {
  NhaRieng = 'NhaRieng',
  ChungCuCaoCap = 'ChungCuCaoCap',
  NhaTrongHem = 'NhaTrongHem',
  NhaTro = 'NhaTro',
}

export interface Demographic {
  id: string;
  ageMin: number;
  ageMax: number | null;
  male: number;
  female: number;
  populationId: string;
}

export interface Household {
  id: string;
  householdSize: number;
  incomeLevel: IncomeLevel | null;
  housingType: HousingType | null;
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

export type UpdatePopulationDTO = Partial<CreatePopulationDTO>;

export interface FindPopulationsQuery {
  districtId?: string;
  year?: number;
}
