import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bus } from "lucide-react"; // For custom bus icon
import { kml } from '@tmcw/togeojson';

const RiyadhMap = () => {
  const kmlFiles = [
    {
      url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/city_3_districts.kml",
      name: "City Districts",
      layer: null, // To store the added layer
    },
    {
      url: "https://raw.githubusercontent.com/mo9a7i/py_arcgis_export_to_KML/refs/heads/main/output/metro_lines_and_stations_2.kml",
      name: "Metro Lines and Stations",
      layer: null, // To store the added layer
    },
  ];

  const [mapLayers, setMapLayers] = useState(kmlFiles);

  const CustomBusIcon = L.divIcon({
    html: `<div style="display: flex; justify-content: center; align-items: center; width: 24px; height: 24px; background-color: white; border-radius: 50%; border: 2px solid #007bff;">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus">
               <rect x="3" y="2" width="18" height="13" rx="2" ry="2"></rect>
               <path d="M8 16h0"></path>
               <path d="M16 16h0"></path>
               <path d="M4 6h16"></path>
               <path d="M4 10h16"></path>
               <path d="M7 20v-2"></path>
               <path d="M17 20v-2"></path>
               <path d="M10 20h4"></path>
             </svg>
           </div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const addKMLToMap = (map: L.Map, file: string, name: string, setLayer: (layer: L.Layer) => void) => {
    fetch(file)
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kmlDocument = parser.parseFromString(kmlText, "application/xml");
  
        const geoJson = kml(kmlDocument); // Convert KML to GeoJSON
  
        const kmlLayer = L.geoJSON(geoJson, {
          style: { color: "blue", weight: 2 },
          pointToLayer: (feature, latlng) => {
            if (feature.properties && feature.properties.type === "BusStop") {
              return L.marker(latlng, { icon: CustomBusIcon });
            }
            return L.circleMarker(latlng);
          },
        });
  
        kmlLayer.addTo(map); // Add the KML layer to the map
        setLayer(kmlLayer); // Save the layer for toggling
      })
      .catch((err) => console.error(`Failed to load KML file: ${name}`, err));
  };
  

  const MapContent = () => {
    const map = useMap();

    useEffect(() => {
      // Load all KML layers
      const updatedLayers = mapLayers.map((file) => {
        let layer = null;
        addKMLToMap(map, file.url, file.name, (newLayer) => (layer = newLayer));
        return { ...file, layer };
      });
      setMapLayers(updatedLayers);
    }, [map]);

    return null;
  };

  const toggleLayer = (index: number, visible: boolean) => {
    const map = useMap();
    const updatedLayers = mapLayers.map((file, idx) => {
      if (idx === index && file.layer) {
        if (visible) {
          map.addLayer(file.layer);
        } else {
          map.removeLayer(file.layer);
        }
      }
      return file;
    });
    setMapLayers(updatedLayers);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {mapLayers.map((file, index) => (
          <div key={file.name}>
            <label>
              <input
                type="checkbox"
                defaultChecked
                onChange={(e) => toggleLayer(index, e.target.checked)}
              />
              {file.name}
            </label>
          </div>
        ))}
      </div>
      <MapContainer
        center={[24.7136, 46.6753]}
        zoom={12}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapContent />
      </MapContainer>
    </div>
  );
};

export default RiyadhMap;
