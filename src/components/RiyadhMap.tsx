import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { kml } from "@tmcw/togeojson";
import { MapLayer } from "../types/map";
import { kmlFiles } from "../config/mapLayers";
import { createDistrictLayer, bindDistrictPopup, addDistrictHoverEffects } from "../layers/DistrictLayer";
import { MapControls } from './MapControls';

// Outside component
const staticMapLayers = kmlFiles;

// Add Mapbox access token

const RiyadhMap = () => {
    const [mapLayers, setMapLayers] = useState<MapLayer[]>(staticMapLayers);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [visibleLayers, setVisibleLayers] = useState<{ [key: string]: boolean }>(kmlFiles.reduce((acc, file) => ({ ...acc, [file.name]: false }), {}));

    const addKMLToMap = useCallback((map: L.Map, mapLayer: MapLayer, setLayer: (layer: L.Layer) => void) => {
        fetch(mapLayer.url)
            .then((res) => res.text())
            .then((kmlText) => {
                const parser = new DOMParser();
                const kmlDocument = parser.parseFromString(kmlText, "application/xml");
                const geoJson = kml(kmlDocument) as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

                const kmlLayer = L.geoJSON(geoJson, {
                    style: (feature) => {
                        if (!feature) return mapLayer.style;

                        if (mapLayer.type === "district") {
                            return {
                                ...createDistrictLayer(feature, mapLayer),
                                zIndex: 100  // Lowest layer
                            };
                        }
                        return {
                            ...mapLayer.style,
                            zIndex: mapLayer.type === "stadium" ? 300 : 200  // Stadiums highest, others middle
                        };
                    },
                    pointToLayer: (feature, latlng) => {
                        if (mapLayer.type === "stadium" && mapLayer.icon) {
                            const marker = L.marker(latlng, { icon: mapLayer.icon });
                            marker.setZIndexOffset(300);
                            
                            // Add stadium popup
                            if (feature.properties?.name) {
                                const popupContent = `
                                    <div style="text-align: center; min-width: 150px; padding: 8px;">
                                        <div style="font-weight: bold; margin-bottom: 4px;">
                                            ${feature.properties.name}
                                        </div>
                                        <div style="color: #666; font-size: 13px;">
                                            ${feature.properties.description || ''}
                                        </div>
                                    </div>
                                `;
                                marker.bindPopup(popupContent);
                            }
                            
                            return marker;
                        }
                        return L.circleMarker(latlng, mapLayer.style);
                    },
                    onEachFeature: (feature, layer) => {
                        if (mapLayer.type === "district") {
                            bindDistrictPopup(feature, layer);
                            addDistrictHoverEffects(feature, layer);
                        }
                    },
                });

                // Set the pane for the entire layer
                kmlLayer.setZIndex(mapLayer.type === "district" ? 100 : 
                                  mapLayer.type === "stadium" ? 300 : 200);

                setLayer(kmlLayer);

                if (mapLayer.type === "district") {
                    console.log("District GeoJSON:", geoJson);
                    console.log("Sample District:", geoJson.features[0]);
                }
            })
            .catch((err) => console.error(`Failed to load KML file: ${mapLayer.name}`, err));
    }, []);

    const MapContent = () => {
        const map = useMap();

        useEffect(() => {
            if (!map) return;

            setMapInstance(map);
            mapLayers.forEach((mapLayer) => {
                if (!mapLayer.layer) {
                    addKMLToMap(map, mapLayer, (newLayer) => {
                        setMapLayers((prev) => prev.map((layer) => (layer.name === mapLayer.name ? { ...layer, layer: newLayer } : layer)));
                    });
                }
            });
        }, [map]);

        return null;
    };

    // Add effect to handle station labels changes
    useEffect(() => {
        if (mapInstance && visibleLayers["Metro Stations"]) {
            const stationsLayer = mapLayers.find(l => l.name === "Metro Stations");
            if (stationsLayer && stationsLayer.layer) {
                // Remove existing layer
                mapInstance.removeLayer(stationsLayer.layer);
                
                // Create new layer
                addKMLToMap(mapInstance, stationsLayer, (newLayer) => {
                    setMapLayers(prev => prev.map(l => 
                        l.name === "Metro Stations" ? { ...l, layer: newLayer } : l
                    ));
                    mapInstance.addLayer(newLayer);
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapInstance, visibleLayers]);

    return (
        <div style={{ position: "relative" }}>
            <MapControls 
                mapLayers={mapLayers} 
                visibleLayers={visibleLayers} 
                mapInstance={mapInstance} 
                setMapLayers={setMapLayers} 
                setVisibleLayers={setVisibleLayers} 
                addKMLToMap={addKMLToMap}
            />
            <MapContainer center={[24.7136, 46.6753]} zoom={11} style={{ height: "100vh", width: "100vw" }}>
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/foursquare/ck7qbe9t20y6v1iqkyeolw8hk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZm91cnNxdWFyZSIsImEiOiJjRGRqOVZZIn0.rMLhJeqI_4VnU2YdIJvD3Q`}
                    attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
                    tileSize={512}
                    zoomOffset={-1}
                    maxZoom={19}
                />
                <MapContent />
            </MapContainer>
        </div>
    );
};

export default RiyadhMap;
