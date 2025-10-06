export interface Image {
  id: string;
  url: string;
  publicId: string;
  createdAt?: string;
}

export interface Accident {
  id: string;
  accidentDate: string;
  severity: string;
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
