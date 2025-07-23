
export interface Stop {
    id: string
    attributes: Attributes;
    parent_station: string;
}

export interface Attributes {
    name: string;
    description: string;
    line: string;
    latitude: number;
    longitude: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface RoutePattern {
    representative_trip: string;
    route_name: string;
}

export interface AdjacentStopsOnLine {
    line: string;
    adjacent_stops: Stop[];
}