import type { GeoJSONPoint, InfraCategory, SchoolLevel, HospitalType, MarketType, UtilityType } from './shared';
import type { Image } from './accident';
export type { InfraCategory, SchoolLevel, HospitalType, MarketType, UtilityType } from './shared';
export interface SchoolDetails {
  studentCapacity: number | null;
  teacherCount: number | null;
  level: SchoolLevel;
}

export interface HospitalDetails {
  bedCapacity: number | null;
  doctorCount: number | null;
  type: HospitalType;
}

export interface ParkDetails {
  area: number | null;
}

export interface MarketDetails {
  stallCount: number | null;
  type: MarketType;
}

export interface UtilityDetails {
  capacity: number | null;
  type: UtilityType;
}

export interface Infrastructure {
  id: string;
  name: string;
  address: string | null;
  category: InfraCategory;
  createdAt: string;
  updatedAt: string;
  geom: GeoJSONPoint | null;
  districtId: string;
  districtName?: string;
  images?: Image[];
  school: SchoolDetails | null;
  hospital: HospitalDetails | null;
  park: ParkDetails | null;
  market: MarketDetails | null;
  utility: UtilityDetails | null;
}

export type CreateInfrastructureDTO = 
  Omit<Infrastructure, 'id' | 'createdAt' | 'updatedAt' | 'geom' | 'district' | 'images'> 
  & { geom: string };

export type UpdateInfrastructureDTO = Partial<CreateInfrastructureDTO>;

export interface FindInfrastructuresQuery {
  districtId?: string;
  category?: InfraCategory;
}

export interface FindWithinRadiusQuery {
  lng: number;
  lat: number;
  radiusInMeters: number;
}
