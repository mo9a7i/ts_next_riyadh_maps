import L from 'leaflet';
import { MetroLine, MetroStop } from '../types/metro';

export const createJsonMetroLine = (line: MetroLine) => {
    const coordinates = line.coords.flat().map(coord => [coord[0], coord[1]] as L.LatLngTuple);
    
    const lineLayer = L.polyline(coordinates, {
        color: line.routeColor,
        weight: 4,
        opacity: 0.8
    });

    // Add popup with line details
    const popupContent = `
        <div style="min-width: 200px; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 8px;">
                ${line.lineName.find(n => n.language === 'en')?.translation || ''}
            </div>
            <div style="color: #666; font-size: 14px;">
                <div>${line.lineName.find(n => n.language === 'ar')?.translation || ''}</div>
                <div style="margin-top: 8px;">
                    <strong>From:</strong> ${line.from}<br>
                    <strong>To:</strong> ${line.to}<br>
                    <strong>Line ID:</strong> ${line.line_id}
                </div>
            </div>
        </div>
    `;
    
    lineLayer.bindPopup(popupContent);
    return lineLayer;
};

export const createJsonMetroStation = (stop: MetroStop) => {
    const latlng: L.LatLngTuple = [parseFloat(stop.stop_lat), parseFloat(stop.stop_lon)];
    
    const popupContent = `<div style="text-align: center; min-width: 180px;">
        <div style="
            font-weight: bold;
            ${stop.isHub ? 'border: 2px solid ' + stop.routeColor + ';' : ''}
            ${stop.isHub ? 'border-radius: 4px;' : ''}
            ${stop.isHub ? 'padding: 4px;' : ''}
            margin-bottom: 4px;
        ">
            ${stop.stop.find(s => s.language === 'ar')?.translation || ''}
        </div>
        <div style="margin-bottom: 8px">${stop.stop.find(s => s.language === 'en')?.translation || ''}</div>
        <div style="color: #666; font-size: 13px; text-align: left">
            <div>Station ID: ${stop.id}</div>
            <div>Line: ${stop.line_id}</div>
            <div>Type: ${stop.transport_mode}</div>
            ${stop.isHub ? '<div style="color: ' + stop.routeColor + '">★ Hub Station</div>' : ''}
            ${stop.isParkRide ? '<div>🅿️ Park & Ride Available</div>' : ''}
        </div>
    </div>`;

    if (stop.isHub) {
        // Create outer ring for hub stations
        const outerRing = L.circleMarker(latlng, {
            radius: 12,
            fillColor: 'transparent',
            color: stop.routeColor,
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0
        });
        
        // Create inner circle
        const innerCircle = L.circleMarker(latlng, {
            radius: 8,
            fillColor: stop.routeColor,
            color: stop.routeColor,
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        });

        // Add parking indicator if it's also a park & ride
        if (stop.isParkRide) {
            const parkingRing = L.circleMarker(latlng, {
                radius: 15,
                fillColor: 'transparent',
                color: '#4CAF50', // Green color for parking
                weight: 2,
                opacity: 0.7,
                fillOpacity: 0,
                dashArray: '4, 4' // Dashed line for parking ring
            });
            
            parkingRing.bindPopup(popupContent);
            outerRing.bindPopup(popupContent);
            innerCircle.bindPopup(popupContent);
            
            return L.layerGroup([parkingRing, outerRing, innerCircle]);
        }

        outerRing.bindPopup(popupContent);
        innerCircle.bindPopup(popupContent);
        
        return L.layerGroup([outerRing, innerCircle]);
    } 

    if (stop.isParkRide) {
        // Create parking station style
        const mainCircle = L.circleMarker(latlng, {
            radius: 8,
            fillColor: stop.routeColor,
            color: stop.routeColor,
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        });

        const parkingRing = L.circleMarker(latlng, {
            radius: 12,
            fillColor: 'transparent',
            color: '#4CAF50', // Green color for parking
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0,
            dashArray: '4, 4' // Dashed line for parking ring
        });

        mainCircle.bindPopup(popupContent);
        parkingRing.bindPopup(popupContent);
        
        return L.layerGroup([parkingRing, mainCircle]);
    }

    // Regular station
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: stop.routeColor,
        color: stop.routeColor,
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).bindPopup(popupContent);
}; 