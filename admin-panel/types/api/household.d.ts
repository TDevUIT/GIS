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
