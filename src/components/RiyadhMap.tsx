import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { kml } from "@tmcw/togeojson";
import { MapLayer } from "../types/map";
import { kmlFiles } from "../config/mapLayers";
import { createDistrictLayer, bindDistrictPopup, addDistrictHoverEffects } from "../layers/DistrictLayer";
import { createMetroLineStyle, bindMetroPopup } from "../layers/MetroLayer";
import { createStationMarker } from "../layers/StationLayer";
import { LayerControls } from "./LayerControls";

// Outside component
const staticMapLayers = kmlFiles;

// Add Mapbox access token
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE_URL = "mapbox://styles/foursquare/ck7qbe9t20y6v1iqkyeolw8hk";

const RiyadhMap = () => {
    const [mapLayers, setMapLayers] = useState<MapLayer[]>(staticMapLayers);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [visibleLayers, setVisibleLayers] = useState<{ [key: string]: boolean }>(kmlFiles.reduce((acc, file) => ({ ...acc, [file.name]: false }), {}));
    const [showAllStationLabels, setShowAllStationLabels] = useState(false);

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
                            return createDistrictLayer(feature, mapLayer);
                        }
                        if (mapLayer.type === "metro") {
                            return createMetroLineStyle(feature, mapLayer);
                        }
                        return mapLayer.style;
                    },
                    pointToLayer: (feature, latlng) => {
                        if (mapLayer.name === "Metro Stations") {
                            return createStationMarker(feature, latlng, mapLayer);
                        }
                        if (mapLayer.type === "stadium" && mapLayer.icon) {
                            return L.marker(latlng, { icon: mapLayer.icon });
                        }
                        return L.circleMarker(latlng, mapLayer.style);
                    },
                    onEachFeature: (feature, layer) => {
                        if (mapLayer.type === "district") {
                            bindDistrictPopup(feature, layer);
                            addDistrictHoverEffects(feature, layer);
                        } else if (mapLayer.type === "metro") {
                            bindMetroPopup(feature, layer, showAllStationLabels);
                        }
                    },
                });

                setLayer(kmlLayer);

                if (mapLayer.type === "district") {
                    console.log("District GeoJSON:", geoJson);
                    console.log("Sample District:", geoJson.features[0]);
                }
            })
            .catch((err) => console.error(`Failed to load KML file: ${mapLayer.name}`, err));
    }, [showAllStationLabels]);

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
    }, [showAllStationLabels, mapInstance, visibleLayers]);

    return (
        <div style={{ position: "relative" }}>
            <LayerControls mapLayers={mapLayers} visibleLayers={visibleLayers} mapInstance={mapInstance} setMapLayers={setMapLayers} setVisibleLayers={setVisibleLayers} addKMLToMap={addKMLToMap} showAllStationLabels={showAllStationLabels} setShowAllStationLabels={setShowAllStationLabels} />
            <MapContainer center={[24.7136, 46.6753]} zoom={12} style={{ height: "100vh", width: "100vw" }}>
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/foursquare/ck7qbe9t20y6v1iqkyeolw8hk/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
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
