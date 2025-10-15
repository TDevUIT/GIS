import { AccidentSeverity } from '~/types/api/accident';

const severityStyles: Record<AccidentSeverity, { color: string; textColor: string; borderColor: string }> = {
    [AccidentSeverity.LOW]: { color: '#22C55E', textColor: '#FFFFFF', borderColor: '#16A34A' },
    [AccidentSeverity.MEDIUM]: { color: '#FBBF24', textColor: '#FFFFFF', borderColor: '#D97706' },
    [AccidentSeverity.HIGH]: { color: '#F97316', textColor: '#FFFFFF', borderColor: '#EA580C' },
    [AccidentSeverity.CRITICAL]: { color: '#EF4444', textColor: '#FFFFFF', borderColor: '#DC2626' },
};

const defaultSeverityStyle = { color: '#6B7280', textColor: '#FFFFFF', borderColor: '#4B5563' };

export function getSeverityStyle(type: AccidentSeverity | string | undefined) {
    if (!type || !severityStyles[type as AccidentSeverity]) {
        return defaultSeverityStyle;
    }
    return severityStyles[type as AccidentSeverity];
}

export function getTrafficLineStyle(accidentCount: number, isSelected: boolean) {
    let color = '#3B82F6';
    let weight = 3;

    if (accidentCount > 5) {
        color = '#F97316';
    }
    if (accidentCount > 10) {
        color = '#EF4444';
    }

    if (isSelected) {
        weight = 6;
        color = '#A78BFA';
    }

    return {
        color,
        weight,
        opacity: isSelected ? 1.0 : 0.7,
    };
}
