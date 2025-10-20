import { QualityLevel } from '~/types/api/shared';

const levelStyles: Record<QualityLevel, { color: string; textColor: string; iconColor: string }> = {
    [QualityLevel.GOOD]: { color: 'bg-green-500/20', textColor: 'text-green-400', iconColor: 'text-green-500' },
    [QualityLevel.MODERATE]: { color: 'bg-yellow-500/20', textColor: 'text-yellow-400', iconColor: 'text-yellow-500' },
    [QualityLevel.UNHEALTHY]: { color: 'bg-orange-500/20', textColor: 'text-orange-400', iconColor: 'text-orange-500' },
    [QualityLevel.HAZARDOUS]: { color: 'bg-red-500/20', textColor: 'text-red-400', iconColor: 'text-red-500' },
};

const defaultStyle = { color: 'bg-gray-500/20', textColor: 'text-gray-400', iconColor: 'text-gray-500' };

export function getQualityLevelStyle(level: QualityLevel | string | null | undefined) {
    if (!level || !levelStyles[level as QualityLevel]) {
        return defaultStyle;
    }
    return levelStyles[level as QualityLevel];
}

export function getQualityMarkerColor(level: QualityLevel | string | null | undefined): string {
    if (!level) return '#9CA3AF';
    switch(level) {
        case QualityLevel.GOOD: return '#22C55E';
        case QualityLevel.MODERATE: return '#FBBF24';
        case QualityLevel.UNHEALTHY: return '#F97316';
        case QualityLevel.HAZARDOUS: return '#EF4444';
        default: return '#9CA3AF';
    }
}
