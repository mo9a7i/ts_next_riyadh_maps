import React, { useState, useEffect } from 'react';
import { MetroData } from '../types/metro';
import { createJsonMetroLine, createJsonMetroStation } from '../layers/JsonMetroLayer';

interface JsonMetroControlsProps {
    mapInstance: L.Map | null;
}

export const JsonMetroControls: React.FC<JsonMetroControlsProps> = ({ mapInstance }) => {
    const [metroData, setMetroData] = useState<MetroData | null>(null);
    const [visibleLines, setVisibleLines] = useState<{ [key: number]: boolean }>({});
    const [layers, setLayers] = useState<{ [key: string]: L.Layer[] }>({});

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/aqar-app/Riyadh-Metro-Routes-and-Stations/refs/heads/main/riyadh_metro.json')
            .then(res => res.json())
            .then((data: MetroData) => {
                setMetroData(data);
                const initialVisibility = Object.fromEntries(
                    data.metro.line.map(line => [line.line_id, false])
                );
                setVisibleLines(initialVisibility);
            });
    }, []);

    const toggleLine = (lineId: number, visible: boolean) => {
        if (!mapInstance || !metroData) return;

        // Remove existing layers
        if (layers[`line-${lineId}`]) {
            layers[`line-${lineId}`].forEach(layer => mapInstance.removeLayer(layer));
        }

        if (visible) {
            const line = metroData.metro.line.find(l => l.line_id === lineId);
            const stops = metroData.metro.stops.filter(s => s.line_id === lineId);
            
            if (line) {
                const newLayers: L.Layer[] = [];
                
                // Add line
                const lineLayer = createJsonMetroLine(line);
                mapInstance.addLayer(lineLayer);
                newLayers.push(lineLayer);
                
                // Add stops
                stops.forEach(stop => {
                    const stopLayer = createJsonMetroStation(stop);
                    mapInstance.addLayer(stopLayer);
                    newLayers.push(stopLayer);
                });
                
                setLayers(prev => ({
                    ...prev,
                    [`line-${lineId}`]: newLayers
                }));
            }
        }

        setVisibleLines(prev => ({
            ...prev,
            [lineId]: visible
        }));
    };

    if (!metroData) return null;

    return (
        <>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Metro Lines</div>
            {metroData.metro.line.map(line => (
                <div
                    key={line.line_id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                        padding: "4px 0",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={visibleLines[line.line_id]}
                        onChange={(e) => toggleLine(line.line_id, e.target.checked)}
                        style={{ marginRight: "8px" }}
                    />
                    <label style={{ 
                        cursor: "pointer",
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{
                            width: 12,
                            height: 12,
                            backgroundColor: line.routeColor,
                            display: 'inline-block',
                            marginRight: 8,
                            borderRadius: '50%'
                        }} />
                        {line.lineName.find(n => n.language === 'en')?.translation || `Line ${line.line_id}`}
                    </label>
                </div>
            ))}
        </>
    );
}; 