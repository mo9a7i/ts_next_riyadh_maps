import L from 'leaflet';
import { MapLayer } from '../types/map';

export const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return {
        fill: `hsla(${hue}, 70%, 60%, 0.2)`,
        border: `hsla(${hue}, 70%, 40%, 0.2)`
    };
};

export const createDistrictLayer = (feature: GeoJSON.Feature, mapLayer: MapLayer) => {
    const districtName = feature.properties?.name || '';
    const colors = getColorFromString(districtName);
    return {
        color: colors.border,
        fillColor: colors.fill,
        weight: mapLayer.style.weight,
        opacity: mapLayer.style.opacity || 1,
        fillOpacity: 1
    };
};

export const bindDistrictPopup = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties) {
        const name = feature.properties.name || '';
        const description = feature.properties.description || '';
        
        layer.bindPopup(`
            <div style="min-width: 200px">
                <h3 style="margin: 0 0 8px 0; font-weight: bold">${name}</h3>
                <p style="margin: 0">${description}</p>
            </div>
        `);
    }
};

export const addDistrictHoverEffects = (feature: GeoJSON.Feature, layer: L.Layer) => {
    layer.on({
        mouseover: (e) => {
            const layer = e.target;
            const districtName = feature.properties?.name || '';
            const colors = getColorFromString(districtName);
            layer.setStyle({
                fillColor: colors.fill.replace('0.2', '0.4'),
                color: colors.border.replace('0.2', '0.4')
            });
        },
        mouseout: (e) => {
            const layer = e.target;
            const districtName = feature.properties?.name || '';
            const colors = getColorFromString(districtName);
            layer.setStyle({
                fillColor: colors.fill,
                color: colors.border
            });
        }
    });
}; 