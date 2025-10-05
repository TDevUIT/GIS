import type { GeoJSONPoint, InfraCategory, SchoolLevel, HospitalType, MarketType, UtilityType } from './shared';

interface SchoolDetails {
  id: string;
  studentCapacity: number | null;
  teacherCount: number | null;
  level: SchoolLevel;
}

interface HospitalDetails {
  id: string;
  bedCapacity: number | null;
  doctorCount: number | null;
  type: HospitalType;
}

interface ParkDetails {
  id: string;
  area: number | null;
}

interface MarketDetails {
  id: string;
  stallCount: number | null;
  type: MarketType;
}

interface UtilityDetails {
  id: string;
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
  geom: GeoJSONPoint;
  districtId: string;
  school: SchoolDetails | null;
  hospital: HospitalDetails | null;
  park: ParkDetails | null;
  market: MarketDetails | null;
  utility: UtilityDetails | null;
}
