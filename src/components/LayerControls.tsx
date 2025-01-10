import React from "react";
import { MapLayer } from "../types/map";
import { toggleLayer } from "../layers/LayerToggle";

interface LayerControlsProps {
    mapLayers: MapLayer[];
    visibleLayers: { [key: string]: boolean };
    mapInstance: L.Map | null;
    setMapLayers: React.Dispatch<React.SetStateAction<MapLayer[]>>;
    setVisibleLayers: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    addKMLToMap: (map: L.Map, mapLayer: MapLayer, setLayer: (layer: L.Layer) => void) => void;
    showAllStationLabels: boolean;
    setShowAllStationLabels: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayerControls: React.FC<LayerControlsProps> = ({ mapLayers, visibleLayers, mapInstance, setMapLayers, setVisibleLayers, addKMLToMap, showAllStationLabels, setShowAllStationLabels }) => {
    const handleStationLabelsToggle = (checked: boolean) => {
        // First update the state
        setShowAllStationLabels(checked);
        
        // Then immediately refresh the layer
        if (mapInstance) {
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
    };

    return (
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
                <div
                    key={file.name}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                        padding: "4px 0",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={visibleLayers[file.name]}
                        onChange={(e) => {
                            if (mapInstance) {
                                toggleLayer(mapInstance, file, e.target.checked, setMapLayers, setVisibleLayers, addKMLToMap);
                            }
                        }}
                        style={{ marginRight: "8px" }}
                    />
                    <label style={{ cursor: "pointer" }}>{file.name}</label>
                </div>
            ))}
            
            {visibleLayers["Metro Stations"] && (
                <div style={{ 
                    borderTop: "1px solid #eee",
                    marginTop: "8px",
                    paddingTop: "8px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                        padding: "4px 0",
                    }}>
                        <input
                            type="checkbox"
                            checked={showAllStationLabels}
                            onChange={(e) => setShowAllStationLabels(e.target.checked)}
                            style={{ marginRight: "8px" }}
                        />
                        <label style={{ cursor: "pointer" }}>Show All Station Labels</label>
                    </div>
                </div>
            )}
        </div>
    );
};
