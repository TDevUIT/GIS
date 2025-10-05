export interface Image {
  id: string;
  url: string;
  publicId: string;
  createdAt: string;
}

export interface Accident {
  id: string;
  accidentDate: string;
  severity: string;
  casualties: number | null;
  trafficId: string;
  images?: Image[];
}
