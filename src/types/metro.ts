export interface MetroTranslation {
    translation: string;
    language: 'en' | 'ar';
}

export interface MetroLine {
    routeColor: string;
    lineName: MetroTranslation[];
    from: string;
    to: string;
    line_id: number;
    coords: number[][][];
}

export interface MetroStop {
    routeColor: string;
    stop: MetroTranslation[];
    stop_lon: string;
    stop_lat: string;
    isHub: boolean;
    isParkRide: boolean;
    id: number;
    line_id: number;
    transport_mode: string;
}

export interface MetroData {
    metro: {
        line: MetroLine[];
        stops: MetroStop[];
    };
} 