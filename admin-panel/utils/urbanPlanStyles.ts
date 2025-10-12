const zoningColors: Record<string, { color: string; textColor: string }> = {
    'Đất công viên cây xanh và công trình công cộng': { color: '#34D399', textColor: '#065F46' },
    'Đất hỗn hợp (Thương mại - Dịch vụ - Du lịch)': { color: '#A78BFA', textColor: '#4C1D95' },
    'Khu dân cư hiện hữu cải tạo - Bảo tồn': { color: '#FBBF24', textColor: '#78350F' },
};

const defaultStyle = { color: '#E5E7EB', textColor: '#374151' };

export function getZoningTypeStyle(type: string) {
    return zoningColors[type] ?? defaultStyle;
}

export function getLeafletStyle(type: string, highlightedType: string | null = null) {
    const style = getZoningTypeStyle(type);
    const isHighlighted = highlightedType === type;
    const isDimmed = highlightedType !== null && !isHighlighted;

    return {
        color: isHighlighted ? '#FFFFFF' : style.color,
        weight: isHighlighted ? 3 : 1.5,
        fillColor: style.color,
        fillOpacity: isDimmed ? 0.1 : isHighlighted ? 0.8 : 0.6,
        opacity: isDimmed ? 0.3 : 1,
    };
}
