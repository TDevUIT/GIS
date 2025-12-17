export const Exchanges = {
  Topic: 'amq.topic',
} as const;

export const RoutingKeys = {
  AccidentRawData: 'accident.raw_data',
  AccidentCleanedData: 'accident.cleaned_data',
  AccidentFinalData: 'accident.final_data',
} as const;

export type AccidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RawAccidentData {
  location: string;
  dateTime: string;
  description: string;
  casualties: { fatalities: number; injuries: number };
  vehiclesInvolved: string[];
  coordinates?: { lat: number; lng: number } | null;
  geom?: string | null;
  sourceUrl: string;
  scrapedAt: string;
}

export interface CleanedAccidentData extends RawAccidentData {
  severity: AccidentSeverity;
}

export interface FinalAccidentData extends CleanedAccidentData {
  trafficId: string | null;
}
