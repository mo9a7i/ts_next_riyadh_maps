import * as L from "leaflet";

declare module "leaflet" {
  export class KML extends L.LayerGroup {
    constructor(kml: string, options?: L.LayerOptions);
    getBounds(): L.LatLngBounds; // Add this method declaration
  }
}
