export interface MapLayer {
    url: string;
    name: string;
    layer: L.Layer | null;
    style: {
        color: string;
        weight: number;
        opacity?: number;
        fillColor?: string;
        fillOpacity?: number;
        radius: number;
    };
    type: "district" | "metro" | "busStop";
}

export interface MetroLine {
    id: string;
    name: string;
    color: string;
    visible: boolean;
} 