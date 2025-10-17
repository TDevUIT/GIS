export type GeoJSONPoint = {
    type: 'Point';
    coordinates: [number, number];
};

export type GeoJSONPolygon = {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
};

export type GeoJSONLineString = {
    type: 'LineString';
    coordinates: [number, number][];
};

export enum InfraCategory {
    SCHOOL = 'SCHOOL',
    HOSPITAL = 'HOSPITAL',
    PARK = 'PARK',
    MARKET = 'MARKET',
    UTILITY = 'UTILITY',
    ADMINISTRATIVE = 'ADMINISTRATIVE',
    OTHER = 'OTHER',
}

export enum SchoolLevel {
    PRESCHOOL = 'PRESCHOOL',
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    HIGH_SCHOOL = 'HIGH_SCHOOL',
    UNIVERSITY = 'UNIVERSITY',
    VOCATIONAL = 'VOCATIONAL',
}

export enum HospitalType {
    GENERAL = 'GENERAL',
    SPECIALIZED = 'SPECIALIZED',
    TRADITIONAL_MEDICINE = 'TRADITIONAL_MEDICINE',
}

export enum MarketType {
    TRADITIONAL = 'TRADITIONAL',
    SUPERMARKET = 'SUPERMARKET',
    MALL = 'MALL',
}

export enum UtilityType {
    WATER_SUPPLY = 'WATER_SUPPLY',
    SEWAGE_TREATMENT = 'SEWAGE_TREATMENT',
    WASTE_TREATMENT = 'WASTE_TREATMENT',
    POWER_PLANT = 'POWER_PLANT',
    GAS_STATION = 'GAS_STATION',
}

export enum TransportMode {
    BUS = 'BUS',
    METRO = 'METRO',
    BRT = 'BRT',
    WATERWAY = 'WATERWAY',
}

export enum AccidentSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}
