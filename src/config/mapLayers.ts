import { MapLayer, MetroLine } from '../types/map';

export const kmlFiles: MapLayer[] = [
    {
        url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/districts/riyadh_city_districts_20250110_014843.kml",
        name: "City Districts",
        layer: null,
        style: {
            color: "#2c3e50",
            weight: 2,
            opacity: 1,
            fillColor: "#3498db",
            fillOpacity: 0.2,
            radius: 0,
        },
        type: "district",
    },
    {
        url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/metro_lines_and_stations_2.kml",
        name: "Metro Lines",
        layer: null,
        style: {
            color: "#e74c3c",
            weight: 4,
            opacity: 0.8,
            radius: 0,
        },
        type: "metro",
    },
    {
        url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/stations.kml",
        name: "Metro Stations",
        layer: null,
        style: {
            color: "#ff0000",
            weight: 2,
            opacity: 1,
            fillColor: "#ffff00",
            fillOpacity: 0.8,
            radius: 8,
        },
        type: "metro",
    },
];

export const initialMetroLines: MetroLine[] = [
    { id: "1", name: "Blue Line", color: "#2196F3", visible: false },
    { id: "2", name: "Green Line", color: "#4CAF50", visible: false },
    { id: "3", name: "Orange Line", color: "#FF9800", visible: false },
    { id: "4", name: "Yellow Line", color: "#FFC107", visible: false },
    { id: "5", name: "Purple Line", color: "#9C27B0", visible: false },
    { id: "6", name: "Red Line", color: "#F44336", visible: false },
]; 