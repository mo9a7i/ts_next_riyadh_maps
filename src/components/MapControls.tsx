import React from 'react';
import { LayerControls } from './LayerControls';
import { JsonMetroControls } from './JsonMetroControls';
import { MapLayer } from '../types/map';

interface MapControlsProps {
    mapLayers: MapLayer[];
    visibleLayers: { [key: string]: boolean };
    mapInstance: L.Map | null;
    setMapLayers: React.Dispatch<React.SetStateAction<MapLayer[]>>;
    setVisibleLayers: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    addKMLToMap: (map: L.Map, mapLayer: MapLayer, setLayer: (layer: L.Layer) => void) => void;
}

export const MapControls: React.FC<MapControlsProps> = (props) => {
    return (
        <div
            style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
        >
            <div style={{
                backgroundColor: "white",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                minWidth: "200px",
            }}>
                <LayerControls {...props} />
            </div>
            <div style={{
                backgroundColor: "white",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                minWidth: "200px",
            }}>
                <JsonMetroControls mapInstance={props.mapInstance} />
            </div>
        </div>
    );
}; 