export function geoJsonToWkt(geoJson: any): string {
    if (!geoJson || (geoJson.type !== 'Polygon' && geoJson.type !== 'MultiPolygon') || !geoJson.coordinates) {
        return '';
    }

    if (geoJson.type === 'Polygon') {
        const coordsString = geoJson.coordinates[0]
            .map((coord: number[]) => `${coord[0]} ${coord[1]}`)
            .join(',');
        return `POLYGON((${coordsString}))`;
    }

    return '';
}

export function wktToGeoJsonString(wkt: string): string | null {
    try {
        const coordsMatch = wkt.match(/POLYGON\s*\(\((.*)\)\)/i);
        if (!coordsMatch || !coordsMatch[1]) {
            throw new Error('Invalid WKT Polygon format');
        }

        const coordPairs = coordsMatch[1].split(',');
        const coordinates = coordPairs.map(pair => {
            const [lng, lat] = pair.trim().split(/\s+/).map(Number);
            if (isNaN(lng) || isNaN(lat)) throw new Error('Invalid coordinate pair');
            return [lng, lat];
        });

        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            coordinates.push(first);
        }

        const geoJson = {
            type: 'Polygon',
            coordinates: [coordinates]
        };

        return JSON.stringify(geoJson);
    } catch (e) {
        console.error("WKT parsing error:", e);
        return null;
    }
}
