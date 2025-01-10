import L from 'leaflet';
import { MapLayer } from '../types/map';
import { getLineColor } from './MetroLayer';

export const createStationMarker = (feature: GeoJSON.Feature, latlng: L.LatLng, mapLayer: MapLayer) => {
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: getLineColor(feature, mapLayer),
        color: getLineColor(feature, mapLayer),
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
    });
};

export const bindStationPopup = (feature: GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties?.name) {
        layer.bindPopup(feature.properties.name);
    }
}; 