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
}

export const LayerControls: React.FC<LayerControlsProps> = ({ mapLayers, visibleLayers, mapInstance, setMapLayers, setVisibleLayers, addKMLToMap }) => {
  
    return (
        <>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Map Layers</div>
            {mapLayers.map((file) => (
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
        </>
    );
};
