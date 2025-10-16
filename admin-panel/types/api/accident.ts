export interface Image {
  id: string;
  url: string;
  publicId: string;
  createdAt?: string;
}

export enum AccidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Accident {
  id: string;
  accidentDate: string;
  severity: AccidentSeverity;
  casualties: number | null;
  trafficId: string;
  traffic?: {
    id: string;
    roadName: string;
  };
  images?: Image[];
}

export type CreateAccidentDTO = Omit<Accident, 'id' | 'images' | 'traffic'>;

export type UpdateAccidentDTO = Partial<CreateAccidentDTO>;

export interface SetImagesDTO {
  images: Omit<Image, 'id' | 'createdAt'>[];
}
