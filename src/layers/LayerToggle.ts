import { MapLayer } from '../types/map';
import L from 'leaflet';

export const toggleLayer = (
    mapInstance: L.Map,
    layer: MapLayer,
    visible: boolean,
    setMapLayers: React.Dispatch<React.SetStateAction<MapLayer[]>>,
    setVisibleLayers: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
    addKMLToMap: (map: L.Map, mapLayer: MapLayer, setLayer: (layer: L.Layer) => void) => void
) => {
    // Remove existing layer
    if (layer.layer) {
        mapInstance.removeLayer(layer.layer);
    }

    // Update visibility state first
    setVisibleLayers((prev) => ({
        ...prev,
        [layer.name]: visible,
    }));

    // If turning off, remove layer reference
    if (!visible) {
        setMapLayers(prev => prev.map(l => 
            l.name === layer.name ? { ...l, layer: null } : l
        ));
        return;
    }

    // Create new layer if toggling on
    addKMLToMap(mapInstance, layer, (newLayer) => {
        setMapLayers((prev) => prev.map((l) => 
            l.name === layer.name ? { ...l, layer: newLayer } : l
        ));
        mapInstance.addLayer(newLayer);
    });
}; 