import { MapLayer } from '../types/map';
import L from 'leaflet';

// Add stadium icon using Material Design Icons
const stadiumIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/google/material-design-icons/refs/heads/master/png/maps/stadium/materialicons/48dp/2x/baseline_stadium_black_48dp.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

export const kmlFiles: MapLayer[] = [
    {
        url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/districts/riyadh_city_districts.kml",
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
        url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/stadiums/2034-world-cup-stadiums.kml",
        name: "World Cup Stadiums",
        layer: null,
        style: {
            color: "#e74c3c",
            weight: 2,
            opacity: 1,
            radius: 8,
        },
        type: "stadium",
        icon: stadiumIcon
    },
];


