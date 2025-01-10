import L from 'leaflet';
import { MapLayer } from '../types/map';
import { getLineInfo } from '../config/mapLayers';
import { getStationInfo } from '../config/stationMappings';

export const getLineColor = (feature: GeoJSON.Feature, mapLayer: MapLayer): string => {
    if (mapLayer.name === "Metro Lines") {
        const lineNumber = feature.properties?.description?.match(/Metro Line: (\d)/)?.[1];
        return lineNumber ? getLineInfo(lineNumber).color : mapLayer.style.color;
    }
    if (mapLayer.name === "Metro Stations") {
        const lineNumber = feature.properties?.name?.match(/^(\d)/)?.[1];
        return lineNumber ? getLineInfo(lineNumber).color : "#808080";
    }
    return mapLayer.style.color;
};

export const createMetroLineStyle = (feature: GeoJSON.Feature, mapLayer: MapLayer) => {
    return {
        color: getLineColor(feature, mapLayer),
        weight: mapLayer.style.weight,
        opacity: mapLayer.style.opacity || 1
    };
};

export const bindMetroPopup = (feature: GeoJSON.Feature, layer: L.Layer, showAllLabels: boolean = false) => {
    if (feature.properties) {
        const stationId = feature.properties.name;
        const stationInfo = stationId ? getStationInfo(stationId) : null;
        const lineNumber = feature.properties.description?.match(/Metro Line: (\d)/)?.[1] ||
            feature.properties.name?.match(/^(\d)/)?.[1];
        const lineInfo = lineNumber ? getLineInfo(lineNumber) : null;
        
        // Just the station name without line info
        const name = stationInfo ? stationInfo.name.ar : 
            feature.properties.name || feature.properties.description;
        
        // Only for stations (not lines)
        if (feature.properties.name?.match(/^(\d)/)) {
            if (showAllLabels) {
                layer.bindTooltip(name, {
                    permanent: true,
                    direction: 'auto',
                    className: 'metro-station-label',
                    offset: [0, 0]
                });
            } else {
                // Custom popup with line color background
                const color = lineInfo?.color || "#808080";
                const popupContent = `<div style="color: white; padding: 2px 6px; text-align: center;">${name}</div>`;
                layer.bindPopup(popupContent, {
                    className: 'metro-popup',
                    closeButton: false
                });
                
                // Add custom CSS for this specific popup
                layer.on('popupopen', (e) => {
                    const popup = e.popup;
                    const popupElement = popup.getElement();
                    if (popupElement) {
                        (popupElement as HTMLElement).style.backgroundColor = color;
                        (popupElement as HTMLElement).style.borderColor = color;
                        
                        const content = popupElement.querySelector('.leaflet-popup-content');
                        if (content) {
                            (content as HTMLElement).style.margin = '0';
                        }
                        
                        const tip = popupElement.querySelector('.leaflet-popup-tip');
                        if (tip) {
                            (tip as HTMLElement).style.backgroundColor = color;
                            (tip as HTMLElement).style.borderColor = color;
                        }
                    }
                });
            }
        } else {
            // For lines, always use popup
            layer.bindPopup(name);
        }
    }
}; 