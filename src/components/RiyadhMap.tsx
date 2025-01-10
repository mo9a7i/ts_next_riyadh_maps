import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { kml } from "@tmcw/togeojson";
import { MapLayer, MetroLine } from '../types/map';
import { kmlFiles, initialMetroLines } from '../config/mapLayers';

// Outside component
const staticMapLayers = kmlFiles;

const RiyadhMap = () => {
    const [mapLayers, setMapLayers] = useState<MapLayer[]>(staticMapLayers);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [visibleLayers, setVisibleLayers] = useState<{ [key: string]: boolean }>(kmlFiles.reduce((acc, file) => ({ ...acc, [file.name]: false }), {}));
    const [metroLines, setMetroLines] = useState<MetroLine[]>(initialMetroLines);

    const getColorFromString = (str: string) => {
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Convert hash to hue (0-360)
        const hue = Math.abs(hash % 360);
        
        return {
            fill: `hsla(${hue}, 70%, 60%, 0.2)`,
            border: `hsla(${hue}, 70%, 40%, 0.2)`
        };
    };

    const addKMLToMap = useCallback((map: L.Map, mapLayer: MapLayer, setLayer: (layer: L.Layer) => void) => {
        fetch(mapLayer.url)
            .then((res) => res.text())
            .then((kmlText) => {
                const parser = new DOMParser();
                const kmlDocument = parser.parseFromString(kmlText, "application/xml");
                const geoJson = kml(kmlDocument) as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

                const flipCoordinates = (geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>) => {
                    const flip = (coords: number[]) => [coords[1], coords[0]];
                    
                    geoJson.features.forEach((feature: GeoJSON.Feature) => {
                        if (feature.geometry.type === 'Polygon') {
                            feature.geometry.coordinates = feature.geometry.coordinates.map(
                                (ring: number[][]) => ring.map(flip)
                            );
                        } else if (feature.geometry.type === 'MultiPolygon') {
                            feature.geometry.coordinates = feature.geometry.coordinates.map(
                                (polygon: number[][][]) => polygon.map(
                                    (ring: number[][]) => ring.map(flip)
                                )
                            );
                        }
                    });
                    return geoJson;
                };

                if (mapLayer.type === "district") {
                    flipCoordinates(geoJson);
                }

                const lineColors: { [key: string]: string } = {
                    "1": "#2196F3", // Blue
                    "2": "#4CAF50", // Green
                    "3": "#FF9800", // Orange
                    "4": "#FFC107", // Yellow
                    "5": "#9C27B0", // Purple
                    "6": "#F44336", // Red
                };

                const getLineColor = (feature: GeoJSON.Feature): string => {
                    if (mapLayer.name === "Metro Lines") {
                        const lineNumber = feature.properties?.description?.match(/Metro Line: (\d)/)?.[1];
                        return lineColors[lineNumber] || mapLayer.style.color;
                    }
                    if (mapLayer.name === "Metro Stations") {
                        const lineNumber = feature.properties?.name?.match(/^(\d)/)?.[1];
                        return lineColors[lineNumber] || "#808080";
                    }
                    return mapLayer.style.color;
                };

                const kmlLayer = L.geoJSON(geoJson, {
                    filter: (feature) => {
                        if (mapLayer.name === "Metro Lines") {
                            const lineNumber = feature.properties?.description?.match(/Metro Line: (\d)/)?.[1];
                            return feature.properties?.description?.startsWith("Metro Line:") && 
                                   metroLines.find((l) => l.id === lineNumber)?.visible;
                        }
                        if (mapLayer.name === "Metro Stations") {
                            return true;  // Always show stations when their layer is toggled
                        }
                        return true;
                    },
                    style: (feature) => {
                        if (!feature) return mapLayer.style;
                        
                        if (mapLayer.type === "district") {
                            const districtName = feature.properties?.name || '';
                            const colors = getColorFromString(districtName);
                            return {
                                color: colors.border,
                                fillColor: colors.fill,
                                weight: mapLayer.style.weight,
                                opacity: mapLayer.style.opacity || 1,
                                fillOpacity: 1
                            };
                        }
                        return {
                            color: getLineColor(feature),
                            weight: mapLayer.style.weight,
                            opacity: mapLayer.style.opacity || 1
                        };
                    },
                    pointToLayer: (feature, latlng) => {
                        if (mapLayer.name === "Metro Stations") {
                            return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: getLineColor(feature),
                                color: getLineColor(feature),
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 1,
                            });
                        }
                        return L.circleMarker(latlng, mapLayer.style);
                    },
                    onEachFeature: (feature, layer) => {
                        if (feature.properties?.name) {
                            layer.bindPopup(feature.properties.name);
                        }
                        
                        if (mapLayer.type === "district") {
                            layer.on({
                                mouseover: (e) => {
                                    const layer = e.target;
                                    const districtName = feature.properties?.name || '';
                                    const colors = getColorFromString(districtName);
                                    layer.setStyle({
                                        fillColor: colors.fill.replace('0.2', '0.4'),  // Darker on hover
                                        color: colors.border.replace('0.2', '0.4')
                                    });
                                },
                                mouseout: (e) => {
                                    const layer = e.target;
                                    const districtName = feature.properties?.name || '';
                                    const colors = getColorFromString(districtName);
                                    layer.setStyle({
                                        fillColor: colors.fill,  // Back to original transparency
                                        color: colors.border
                                    });
                                }
                            });
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
    }, [metroLines]);

    const MapContent = () => {
        const map = useMap();

        useEffect(() => {
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

    const toggleLayer = (index: number, visible: boolean) => {
        if (!mapInstance) return;

        const layer = mapLayers[index];
        if (layer && layer.layer) {
            if (visible) {
                mapInstance.addLayer(layer.layer);
            } else {
                mapInstance.removeLayer(layer.layer);
            }
            setVisibleLayers((prev) => ({
                ...prev,
                [layer.name]: visible,
            }));
        }
    };

    useEffect(() => {
        if (!mapInstance) return;

        mapLayers.forEach((mapLayer) => {
            if (mapLayer.layer) {
                mapInstance.removeLayer(mapLayer.layer);
                if (visibleLayers[mapLayer.name]) {
                    addKMLToMap(mapInstance, mapLayer, (newLayer) => {
                        setMapLayers((prev) => prev.map((layer) => (layer.name === mapLayer.name ? { ...layer, layer: newLayer } : layer)));
                        if (visibleLayers[mapLayer.name]) {
                            mapInstance.addLayer(newLayer);
                        }
                    });
                }
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metroLines, mapInstance, visibleLayers]);

    const toggleMetroLines = (checked: boolean) => {
        setMetroLines(prev => prev.map(line => ({ ...line, visible: checked })));
        toggleLayer(mapLayers.findIndex(layer => layer.name === "Metro Lines"), checked);
    };

    const getMetroLinesToggleState = () => {
        const visibleCount = metroLines.filter(line => line.visible).length;
        if (visibleCount === 0) return false;
        if (visibleCount === metroLines.length) return true;
        return 'indeterminate';
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    minWidth: "200px",
                }}
            >
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Map Layers</div>
                {mapLayers.map((file, index) => (
                    <div key={file.name}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "6px",
                                padding: "4px 0",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={file.name === "Metro Lines" ? getMetroLinesToggleState() as boolean : visibleLayers[file.name]}
                                ref={node => {
                                    if (node && file.name === "Metro Lines") {
                                        node.indeterminate = getMetroLinesToggleState() === 'indeterminate';
                                    }
                                }}
                                onChange={(e) => {
                                    if (file.name === "Metro Lines") {
                                        toggleMetroLines(e.target.checked);
                                    } else {
                                        toggleLayer(index, e.target.checked);
                                    }
                                }}
                                style={{ marginRight: "8px" }}
                            />
                            <label style={{ cursor: "pointer" }}>
                                {file.name}
                            </label>
                        </div>
                        {file.name === "Metro Lines" && visibleLayers[file.name] && (
                            <div style={{ marginLeft: "20px" }}>
                                {metroLines.map((line) => (
                                    <div key={line.id} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                                        <input
                                            type="checkbox"
                                            checked={line.visible}
                                            onChange={(e) => {
                                                setMetroLines((prev) => prev.map((l) => (l.id === line.id ? { ...l, visible: e.target.checked } : l)));
                                            }}
                                            style={{ marginRight: "8px" }}
                                        />
                                        <div
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                backgroundColor: line.color,
                                                marginRight: "8px",
                                                borderRadius: "2px",
                                            }}
                                        />
                                        <label style={{ cursor: "pointer" }}>{line.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <MapContainer center={[24.7136, 46.6753]} zoom={12} style={{ height: "100vh", width: "100vw" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                <MapContent />
            </MapContainer>
        </div>
    );
};

export default RiyadhMap;
