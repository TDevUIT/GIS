import { ref } from 'vue';

const defaultStyle = { color: '#E5E7EB', textColor: '#374151' };

const landUseColors: Record<string, { color: string; textColor: string }> = {
    'Đất ở đô thị': { color: '#FBBF24', textColor: '#78350F' },
    'Đất thương mại, dịch vụ': { color: '#F87171', textColor: '#7F1D1D' },
    'Đất cây xanh công viên': { color: '#34D399', textColor: '#065F46' },
    'Đất công nghiệp': { color: '#9CA3AF', textColor: '#1F2937' },
    'Đất giao thông': { color: '#A78BFA', textColor: '#4C1D95' },
    'Đất công cộng': { color: '#60A5FA', textColor: '#1E3A8A' },
};

export function getLandUseTypeStyle(type: string) {
    const style = landUseColors[type] ?? defaultStyle;
    return ref(style);
}

export function getLeafletStyle(type: string, highlightedType: string | null = null) {
    const style = landUseColors[type] ?? defaultStyle;
    const isHighlighted = highlightedType === type;
    const isDimmed = highlightedType !== null && !isHighlighted;

    return {
        color: isHighlighted ? '#FFFFFF' : style.color,
        weight: isHighlighted ? 3 : 1.5,
        fillColor: style.color,
        fillOpacity: isDimmed ? 0.1 : (isHighlighted ? 0.8 : 0.6),
        opacity: isDimmed ? 0.3 : 1,
    };
}
