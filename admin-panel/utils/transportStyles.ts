import { TransportMode } from '~/types/api/shared';

const modeStyles: Record<TransportMode, { color: string; textColor: string; icon?: string }> = {
    [TransportMode.BUS]: { color: '#3B82F6', textColor: '#FFFFFF' },      
    [TransportMode.METRO]: { color: '#EF4444', textColor: '#FFFFFF' },     
    [TransportMode.BRT]: { color: '#8B5CF6', textColor: '#FFFFFF' },      
    [TransportMode.WATERWAY]: { color: '#10B981', textColor: '#FFFFFF' },
};

const defaultStyle = { color: '#6B7280', textColor: '#FFFFFF' };

export function getTransportModeStyle(mode: TransportMode | string | undefined) {
    if (!mode || !modeStyles[mode as TransportMode]) {
        return defaultStyle;
    }
    return modeStyles[mode as TransportMode];
}

export function getTransportLineStyle(mode: TransportMode, isSelected: boolean) {
    const style = getTransportModeStyle(mode);
    return {
        color: style.color,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 1.0 : 0.75,
    };
}
